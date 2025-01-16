import { Inject, Module, type OnModuleInit } from '@nestjs/common';
import * as kafkalib from '@confluentinc/kafka-javascript';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'KAFKA_PRODUCER',
      useFactory: (configService: ConfigService) => {
        return new kafkalib.KafkaJS.Kafka({
          'bootstrap.servers': configService.get('KAFKA_BROKER'),
        }).producer();
      },
      inject: [ConfigService],
    },
  ],
  exports: ['KAFKA_PRODUCER'],
})
export class KafkaModule implements OnModuleInit {
  constructor(
    @Inject('KAFKA_PRODUCER') private kafkaProducer: kafkalib.KafkaJS.Producer,
  ) {}

  async onModuleInit() {
    await this.kafkaProducer.connect();
  }
}
