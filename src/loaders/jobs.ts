const config = require('../config');
// const EmailSequenceJob = '@/jobs/emailSequence';
const Agenda = require('agenda');

module.exports = (agenda) => {
    //   agenda.define(
    //     'send-email',
    //     { priority: 'high', concurrency: config.agenda.concurrency },
    //     new EmailSequenceJob().handler,
    //   );

    //   agenda.start();
};