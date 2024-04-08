import { SQSEvent } from "aws-lambda";

exports.handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    const { body } = record;

    console.log("body", body);
  }
};
