const dataReader = require('./data-reader');
const batchedInsert = require('./batch-postgres-insert');
const batchJob = require('./utils/batch-job');
const batcher = require('./utils/batcher');
const aggregator = require('./data-aggregator');
const Pipeline = require('./utils/producer-result-pipeline');

const progress = (start, end, interval) => {
    const totalValues = (end - start) / interval;
    let cnt = 0;

    return (items) => {
        cnt += items.length;
        console.log(`Processsed ${cnt} of ${totalValues} (${Math.round(cnt / totalValues * 100)}%)`);
    };
};

module.exports = async (db, measurementId, levels, start, end, interval, batchSize) => {

    const pipeline = Pipeline(10);
    const generator = dataReader(start, end, interval);
    const batchedProgressInfo = batcher(batchSize, progress(start, end, interval));
    const rawBatchedUpload = batcher(batchSize, pipeline.wrapResultFunction(batchedInsert.raw(measurementId, db)));
    const aggregationsBatchedUpload = levels
        .filter(a => a.id !== 'raw')
        .map(l => aggregator(l.id, l.step, batcher(batchSize, pipeline.wrapResultFunction(batchedInsert.aggregation(measurementId, l.id, db)))));

    await batchJob(generator, [batchedProgressInfo, rawBatchedUpload, ...aggregationsBatchedUpload], pipeline.canProduce);

};
