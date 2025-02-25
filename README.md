# Truter
Desafio Truter* (fake name)

# Setup necessário

Docker e Docker Compose. Mais nada.

# Instruções

1. Se for rodar localmente. Garanta que em backend/scripts/ não tenha o arquivo .init_done - Sempre que for reiniciar do zero precisa deletar esse check.
2. Execute `docker compose down -v && docker compose up --build` na raiz isso vai inicializar o front e o backend juntos. O backend termina mais rápido, o front pode demorar dependendo da máquina. React é assim mesmo. Na minha levou 38 segundos.
3. Acesse http://localhost:4000/ para a API GraphQL.
4. Acesse http://localhost:5173/ para acessar o Frontend.


# Rodando Testes e2e

Basta rodar `bash runtTests.sh` e aguardar o processo.

# Possíveis Adições Futuras

## Observabilidade e Monitoramento
- **OpenTelemetry e Jaeger** → Para implementar tracing distribuído e monitorar requisições no sistema.
- **Node.js CPU Profiling** → Para identificar gargalos de desempenho no backend.  
  - Uma boa referência para leitura e análise de perfis de CPU: [cpupro](https://discoveryjs.github.io/cpupro/).

## Testes de Carga e Segurança
- **Criar um programa em Go** → Desenvolver uma ferramenta para simular chamadas esperadas no sistema, incluindo testes de carga e cenários adversos.  
  - Possível implementação de ataques **DDoS controlados** para avaliar a resiliência do backend.

---

### Sugestões Futuras
- Adicionar métricas com **Prometheus** e visualização via **Grafana**.
- Explorar **Auto-Instrumentação do Node.js com OpenTelemetry** para simplificar o tracing.
- Criar alertas baseados em **métricas de CPU e latência**.
