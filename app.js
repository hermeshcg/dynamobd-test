const AWS = require('aws-sdk');
const dotenv = require('dotenv');

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração do DynamoDB
AWS.config.update({
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// Crie uma instância do cliente DynamoDB
const dynamodb = new AWS.DynamoDB();

async function createTable() {
  var params = {
    AttributeDefinitions: [
      {
        AttributeName: 'Token',
        AttributeType: 'S',
      },
      // {
      //   AttributeName: 'URL',
      //   AttributeType: 'S',
      // },
    ],
    KeySchema: [
      {
        AttributeName: 'Token',
        KeyType: 'HASH',
      },
      // {
      //   AttributeName: 'URL',
      //   KeyType: 'RANGE',
      // },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: 'teste_token3',
    StreamSpecification: {
      StreamEnabled: false,
    },
  };

  // Call DynamoDB to create the table
  dynamodb.createTable(params, function (err, data) {
    if (err) {
      console.log('Error', err);
    } else {
      console.log('Table Created', data);
    }
  });
}

async function manipulate() {
  try {
    const token = 'aisdjasiajsd2';

    // Salva o token na tabela do DynamoDB
    const params = {
      TableName: 'teste_token3',
      Item: {
        Token: { S: token },
      },
    };

    await dynamodb.putItem(params).promise();
    console.log('item created');
    params.Item = {
      ...params.Item,
      URL: { S: 'teste.com' },
    };
    await dynamodb.putItem(params).promise();
    console.log('item edited');

    // Recupera o token da tabela do DynamoDB
    const params2 = {
      TableName: 'teste_token3',
      Key: {
        Token: { S: token },
      },
    };

    const result = await dynamodb.getItem(params2).promise();
    console.log(result);
  } catch (error) {
    console.log('======> ERROR', error);
  }
}

// createTable();
dynamodb.listTables({ Limit: 10 }, function (err, data) {
  if (err) {
    console.log('Error', err.code);
  } else {
    console.log('Table names are ', data.TableNames);
  }
});
// manipulate();
