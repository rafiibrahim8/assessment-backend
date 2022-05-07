let app = require('../../src/app');
let userModel = require('../../src/models/User');
let createAccount = require('../utils/create-account');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let golbalVar = {};

module.exports = describe('User', () => {
    before((done) => {
        userModel.deleteMany({}, (err) => {
            Promise.resolve(createAccount()).then(tokens=>{
                golbalVar.tokens = tokens;
                done();
            });
        });      
    });

    after((done) => {
        userModel.deleteMany({}, (err) => { 
            done();           
        });        
    });

    describe('View/Edit/Delete', () => {
        it('admin should be able to view all users', (done) => {
            chai.request(app)
            .get('/api/v1/user')
            .set('Authorization', 'Bearer ' + golbalVar.tokens.admin)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
            done();
            });
        });

        it('admin should be able to add new users', (done) => {
            chai.request(app)
            .post('/api/v1/user')
            .set('Authorization', 'Bearer ' + golbalVar.tokens.admin)
            .send({
                username: 'abc', password: 'abcdefghij', role: 'student'
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
            done();
            });
        });

        it('admin should be able to edit users', (done) => {
            chai.request(app)
            .patch('/api/v1/user/abc')
            .set('Authorization', 'Bearer ' + golbalVar.tokens.admin)
            .send({role: 'mentor'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.msg.should.be.eql('Success');
            done();
            });
        });

        it('admin should be able to delete users', (done) => {
            chai.request(app)
            .delete('/api/v1/user/abc')
            .set('Authorization', 'Bearer ' + golbalVar.tokens.admin)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.msg.should.be.eql('Success');
            done();
            });
        });
    });
});
