import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://davialves08.github.io/02-TesteAutomatizado/');
  });

  // ========== GRUPO 1: Cadastro de Alunos ==========

  test.describe('Cadastro de Alunos', () => {

    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
      await expect(page.getByRole('cell', { name: 'João Silva', exact: true })).toBeVisible();    });

    test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Ana Costa');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('cadastrado com sucesso');
    });

    test('não deve cadastrar aluno sem nome', async ({ page }) => {
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });

  // ========== GRUPO 2: Cálculo de Média ==========

  test.describe('Cálculo de Média', () => {

    test('deve calcular a média aritmética das três notas', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Pedro Santos');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      const celulaMedia = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(4);
      await expect(celulaMedia).toHaveText('8.00');
    });

  });

  // ========== GRUPO 3: Validação de Notas ==========

  test.describe('Validação de Notas', () => {

    test('não deve aceitar notas fora do intervalo 0–10', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Erro Nota');
      await page.getByLabel('Nota 1').fill('11');
      await page.getByLabel('Nota 2').fill('-1');
      await page.getByLabel('Nota 3').fill('5');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });

  // ========== GRUPO 4: Busca ==========

  test.describe('Busca de Alunos', () => {

    test('deve filtrar aluno pelo nome', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Carlos');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Mariana');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('6');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByPlaceholder('Filtrar alunos...').fill('Carlos');

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(1);
      await expect(page.getByRole('cell', { name: 'Carlos', exact: true })).toBeVisible();
    });

  });

  // ========== GRUPO 5: Exclusão ==========

  test.describe('Exclusão de Alunos', () => {

    test('deve excluir um aluno da tabela', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Delete');
      await page.getByLabel('Nota 1').fill('6');
      // FIX #2: faltavam Nota 2 e Nota 3 — cadastro não era realizado.
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('8');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByRole('button', { name: 'Excluir Aluno Delete' }).click();

      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });

  // ========== GRUPO 6: Estatísticas ==========

  test.describe('Estatísticas', () => {

    test('deve exibir totais corretos de situações', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Aprovado');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('9');
      await page.getByLabel('Nota 3').fill('10');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Aluno Recuperação');
      await page.getByLabel('Nota 1').fill('5');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('5');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Aluno Reprovado');
      await page.getByLabel('Nota 1').fill('2');
      await page.getByLabel('Nota 2').fill('4');
      await page.getByLabel('Nota 3').fill('3');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

   
      await expect(page.getByTestId('total-aprovados').locator('span').first()).toHaveText('1');
      await expect(page.getByTestId('total-recuperacao').locator('span').first()).toHaveText('1');
      await expect(page.getByTestId('total-reprovados').locator('span').first()).toHaveText('1');
    });

  });

  // ========== GRUPO 7: Situação do Aluno ==========

  test.describe('Situação do Aluno', () => {

    test('deve exibir "Aprovado" para média ≥ 7', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno OK');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos .badge-aprovado')).toBeVisible();
    });

    test('deve exibir "Reprovado" para média < 5', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Ruim');
      await page.getByLabel('Nota 1').fill('2');
      await page.getByLabel('Nota 2').fill('3');
      await page.getByLabel('Nota 3').fill('4');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos .badge-reprovado')).toBeVisible();
    });

    test('deve exibir "Recuperação" para média entre 5 e 6.9', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Médio');
      await page.getByLabel('Nota 1').fill('5');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#tabela-alunos .badge-recuperacao')).toBeVisible();
    });

  });

  // ========== GRUPO 8: Múltiplos Cadastros ==========

  test.describe('Múltiplos Cadastros', () => {

    test('deve cadastrar vários alunos consecutivamente', async ({ page }) => {
      const alunos = [
        { nome: 'A1', n1: '4', n2: '8', n3: '10' },
        { nome: 'A2', n1: '7', n2: '7', n3: '7' },
        { nome: 'A3', n1: '2', n2: '5', n3: '6' }
      ];

      for (const aluno of alunos) {
        await page.getByLabel('Nome do Aluno').fill(aluno.nome);
        await page.getByLabel('Nota 1').fill(aluno.n1);
        await page.getByLabel('Nota 2').fill(aluno.n2);
        await page.getByLabel('Nota 3').fill(aluno.n3);
        await page.getByRole('button', { name: 'Cadastrar' }).click();
      }

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);
    });

  });

  // ========== GRUPO 9: Asserções e Boas Práticas ==========

  test.describe('Asserções e Boas Práticas', () => {

    test('deve validar elementos básicos da interface', async ({ page }) => {
      await expect(page).toHaveTitle(/QS Acadêmico/);
      await expect(page.locator('#secao-cadastro')).toBeVisible();
      await expect(page.getByLabel('Nome do Aluno')).toHaveAttribute(
        'placeholder',
        'Digite o nome completo'
      );
    });

    test('deve exibir mensagem de tabela vazia inicialmente', async ({ page }) => {
      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });

    test('deve validar contagem de linhas na tabela', async ({ page }) => {
      const alunos = [
        { nome: 'A1', n1: '4', n2: '8', n3: '10' },
        { nome: 'A2', n1: '7', n2: '7', n3: '7' },
        { nome: 'A3', n1: '2', n2: '5', n3: '6' }
      ];

      for (const aluno of alunos) {
        await page.getByLabel('Nome do Aluno').fill(aluno.nome);
        await page.getByLabel('Nota 1').fill(aluno.n1);
        await page.getByLabel('Nota 2').fill(aluno.n2);
        await page.getByLabel('Nota 3').fill(aluno.n3);
        await page.getByRole('button', { name: 'Cadastrar' }).click();
      }

      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);
    });

    test('deve remover aluno da tela após exclusão', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByRole('button', { name: 'Excluir João Silva' }).click();

      await expect(page.getByRole('cell', { name: 'João Silva', exact: true })).not.toBeVisible();
    });

    test('deve validar conteúdo de estatísticas', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno 1');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Aluno 2');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.getByLabel('Nome do Aluno').fill('Aluno 3');
      await page.getByLabel('Nota 1').fill('10');
      await page.getByLabel('Nota 2').fill('9');
      await page.getByLabel('Nota 3').fill('8');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#stat-total')).toHaveText('3');
    });

  });

  test.describe('Confirmação de Limpeza', () => {

    test('deve limpar todos os alunos ao confirmar', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Teste');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      page.on('dialog', async dialog => {
        await dialog.accept();
      });

      await page.getByRole('button', { name: 'Limpar Tudo' }).click();

      await expect(page.getByText('Nenhum aluno cadastrado.')).toBeVisible();
    });

    test('não deve limpar ao cancelar', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Teste');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      page.on('dialog', async dialog => {
        await dialog.dismiss();
      });

      await page.getByRole('button', { name: 'Limpar Tudo' }).click();

      await expect(page.getByRole('cell', { name: 'Teste', exact: true })).toBeVisible();
    });

  });

});