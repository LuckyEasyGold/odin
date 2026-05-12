#!/usr/bin/env node

import { Command } from 'commander';
import axios from 'axios';
import chalk from 'chalk';
import fs from 'fs';

const program = new Command();
const API_URL = process.env.ODIN_API_URL || 'http://localhost:3001/api/v1';

program
  .name('odin')
  .description('ODIN CLI - Infraestrutura de Documentos Profissionais')
  .version('0.1.0');

program
  .command('whoami')
  .description('Ver informações do usuário autenticado')
  .option('-k, --key <key>', 'Sua x-api-key')
  .action(async (options) => {
    const apiKey = options.key || process.env.ODIN_API_KEY;
    if (!apiKey) {
      console.error(chalk.red('\n❌ Erro: x-api-key não fornecida.\n'));
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { 'x-api-key': apiKey }
      });
      const u = response.data;
      console.log(chalk.cyan.bold('\n👤 Perfil ODIN:'));
      console.log(`ID: ${chalk.gray(u.id)}`);
      console.log(`Nome: ${chalk.white(u.fullName)}`);
      console.log(`Usuário: ${chalk.white(u.username)}`);
      console.log(`Especialista: ${u.isSpecialist ? chalk.green('Sim (' + u.specialty + ')') : chalk.gray('Não')}\n`);
    } catch (error) {
      console.error(chalk.red(`\n❌ Erro: ${error.response?.data?.error || error.message}\n`));
    }
  });

program
  .command('balance')
  .description('Consultar saldo disponível na carteira')
  .option('-k, --key <key>', 'Sua x-api-key')
  .action(async (options) => {
    const apiKey = options.key || process.env.ODIN_API_KEY;
    if (!apiKey) {
      console.error(chalk.red('\n❌ Erro: x-api-key não fornecida.\n'));
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/me`, {
        headers: { 'x-api-key': apiKey }
      });
      console.log(`\n💰 Saldo Atual: ${chalk.green.bold('R$ ' + response.data.balance.toFixed(2))}\n`);
    } catch (error) {
      console.error(chalk.red(`\n❌ Erro: ${error.response?.data?.error || error.message}\n`));
    }
  });

program
  .command('list')
  .description('Listar todos os modelos disponíveis')
  .action(async () => {
    try {
      const response = await axios.get(`${API_URL}/models`);
      console.log(chalk.blue.bold('\n🏛️  Modelos Disponíveis no ODIN:\n'));
      response.data.forEach(m => {
        const verified = m.isVerified ? chalk.cyan(' [🛡️ Verificado]') : '';
        const price = Number(m.price) > 0 ? chalk.yellow(`R$ ${Number(m.price).toFixed(2)}`) : chalk.green('Grátis');
        console.log(`${chalk.green(m.slug.padEnd(30))} | ${price.padEnd(20)} | ${m.name}${verified}`);
      });
      console.log('');
    } catch (error) {
      console.error(chalk.red('Erro ao buscar modelos. Verifique se a API está rodando.'));
    }
  });

program
  .command('generate')
  .description('Gerar um documento a partir de um modelo')
  .argument('<slug>', 'Slug do modelo')
  .option('-k, --key <key>', 'Sua x-api-key')
  .option('-i, --inputs <json>', 'Inputs em formato JSON', '{}')
  .option('-o, --output <filename>', 'Nome do arquivo de saída', 'documento.html')
  .action(async (slug, options) => {
    const apiKey = options.key || process.env.ODIN_API_KEY;

    if (!apiKey) {
      console.error(chalk.red('\n❌ Erro: x-api-key não fornecida. Use --key ou defina ODIN_API_KEY.\n'));
      return;
    }

    try {
      console.log(chalk.yellow(`\n🚀 Gerando documento para ${slug}...`));
      
      const response = await axios.post(`${API_URL}/generate`, {
        modelId: slug,
        inputs: JSON.parse(options.inputs)
      }, {
        headers: { 'x-api-key': apiKey }
      });

      if (response.data.html) {
        fs.writeFileSync(options.output, response.data.html);
        console.log(chalk.green(`\n✅ Sucesso! Documento salvo em: ${chalk.bold(options.output)}\n`));
      }
    } catch (error) {
      console.error(chalk.red(`\n❌ Erro na geração: ${error.response?.data?.error || error.message}\n`));
    }
  });

program.parse();
