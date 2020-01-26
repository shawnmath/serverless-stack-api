import uuid from 'uuid';
// import AWS from 'aws-sdk';
import * as dynamoDBLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main( event, context ) {
  const data = typeof event === 'object' ? event.body : JSON.parse( event.body );

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now(),
    }
  };

  try {
    await dynamoDBLib.call( 'put', params );
    return success( params.Item );
  } catch( e ) {
    return failure( { status: false } );
  }
}

// AWS.config.update({ region: "us-east-2" });
// const dynamoDB = new AWS.DynamoDB.DocumentClient();

// export function main( event, context, callback ) {
//   // const data = JSON.parse( event.body );
//   const data = event.body;

//   const params = {
//     TableName: process.env.tableName,
//     // 'Item' contains the attributes of the item to be created
//     // - 'userId': user identities are federated through the
//     //             Cognito Identity Pool, we will use the identity id
//     //             as the user id of the authenticated user
//     // - 'noteId': a unique uuid
//     // - 'content': parsed from request body
//     // - 'attachment': parsed from request body
//     // - 'createdAt': current Unix timestamp
//     Item: {
//       userId: event.requestContext.identity.cognitoIdentityId,
//       noteId: uuid.v1(),
//       content: data.content,
//       attachment: data.attachment,
//       createdAt: Date.now()
//     }
//   };

//   dynamoDB.put( params, ( error, data ) => {
//     const headers = {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Credentials": true
//     };

//     let response;

//     if ( error ) {
//       console.log(error);
//       response = {
//         statusCode: 500,
//         headers,
//         body: JSON.stringify( { status: false } )
//       };
//       callback( null, response );
//       return;
//     }

//     response = {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify( params.Item )
//     };
//     callback( null, response );
//   } );
// };