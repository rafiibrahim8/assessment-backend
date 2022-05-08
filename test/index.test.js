process.env.NODE_ENV = 'test';

let chai = require('chai');
const mongoose = require('mongoose');
let should = chai.should();

after(done => {
    mongoose.connection.close();
    done();
});

require('./tfiles/account.test');
require('./tfiles/assessment.test');
require('./tfiles/submission.test');
require('./tfiles/user.test');
