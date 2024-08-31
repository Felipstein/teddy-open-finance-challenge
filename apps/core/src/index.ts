import env from '@env';
import server from '@infra/http/express/server';

function startServer(port: number) {
  return new Promise<void>((resolve) => {
    server.listen(port, () => resolve());
  });
}

async function main() {
  await startServer(env().PORT);

  console.info(`Server running at port ${env().PORT}`);
}

main();
