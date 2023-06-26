import { LessThanOrEqual, Repository } from 'typeorm'
import dataSource from './config'
import { LocalMessage } from './local-message.entity'

export class LocalMessageRepository extends Repository<LocalMessage> {
  constructor() {
    super(LocalMessage, dataSource.manager)
  }

  public getMessagesOfConservation(conservationId: string) {
    return this.find({ where: { conservationId } })
  }

  public async deleteMessage(messageId: string) {
    const message = await this.findOne({ where: { messageId } })
    await this.remove(message)
  }

  public async deleteConservation(conservationId: string) {
    const messages = await this.find({ where: { conservationId } })
    await this.remove(messages)
  }

  public async saveMessage(
    conservationId: string,
    messageId: string,
    plainText: string,
  ) {
    await this.save(this.create({ conservationId, messageId, plainText }))
  }

  public async removeMessagesAfter30Days() {
    const time = new Date()
    time.setDate(time.getDate() - 30)
    const messages = await this.find({
      where: { createdAt: LessThanOrEqual(time) },
    })
    if (messages.length) {
      await this.remove(messages)
    }
  }
}
