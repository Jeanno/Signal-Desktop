/* global Backbone: false */
/* global Whisper: false */
/* global ConversationController: false */
/* global _: false */

/* eslint-disable more/no-then */

// eslint-disable-next-line func-names
(function() {
  'use strict';

  window.Whisper = window.Whisper || {};

  Whisper.DeliveryReceipts = new (Backbone.Collection.extend({
    forMessage(conversation, message) {
      let recipients;
      if (conversation.isPrivate()) {
        recipients = [conversation.id];
      } else {
        recipients = conversation.get('members') || [];
      }
      const receipts = this.filter(
        receipt =>
          receipt.get('timestamp') === message.get('sent_at') &&
          recipients.indexOf(receipt.get('source')) > -1
      );
      this.remove(receipts);
      return receipts;
    },
    async getTargetMessage(source, messages) {
      if (messages.length === 0) {
        return null;
      }
      const message = messages.find(
        item => !item.isIncoming() && source === item.get('conversationId')
      );
      if (message) {
        return message;
      }

      const groups = new Whisper.GroupCollection();
      await groups.fetchGroups(source);

      const ids = groups.pluck('id');
      ids.push(source);

      return messages.find(
        item =>
          !item.isIncoming() && _.contains(ids, item.get('conversationId'))
      );
    },
    async onReceipt(receipt) {
      try {
        const messages = await window.Signal.Data.getMessagesBySentAt(
          receipt.get('timestamp'),
          {
            MessageCollection: Whisper.MessageCollection,
          }
        );

        const message = await this.getTargetMessage(
          receipt.get('source'),
          messages
        );
        if (!message) {
          window.log.info(
            'No message for delivery receipt',
            receipt.get('source'),
            receipt.get('timestamp')
          );
          return;
        }

        const deliveries = message.get('delivered') || 0;
        const deliveredTo = message.get('delivered_to') || [];

        message.set({
          delivered_to: _.union(deliveredTo, [receipt.get('source')]),
          delivered: deliveries + 1,
        });

        await window.Signal.Data.saveMessage(message.attributes, {
          Message: Whisper.Message,
        });
        // notify frontend listeners
        const conversation = ConversationController.get(
          message.get('conversationId')
        );
        if (conversation) {
          conversation.trigger('delivered', message);
        }

        this.remove(receipt);

        // TODO: consider keeping a list of numbers we've
        // successfully delivered to?
      } catch (error) {
        window.log.error(
          'DeliveryReceipts.onReceipt error:',
          error && error.stack ? error.stack : error
        );
      }
    },
  }))();
})();
