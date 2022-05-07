let app = require('../../src/app');
let userModel = require('../../src/models/User');
let createAccount = require('../utils/create-account');
let chai = require('chai');
let chaiHttp = require('chai-http');
let crypto = require('crypto');

chai.use(chaiHttp);

let golbalVar = {};

module.exports = describe('Assessment', () => {
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

    describe('Create/Edit/Delete', () => {
        it('student shound not able to create assessment', (done) => {
            chai.request(app)
                .post('/api/v1/assessment/create')
                .set('Authorization', 'Bearer ' + golbalVar.tokens.student)
                .send({
                    title: 'Test Assignment',
                    description: 'A test Assignment',
                    deadline: Date.now() + 12*3600*1000
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.msg.should.be.eql('Insufficient permission');
                done();
                });
        });

        it('mentor shound able to create assessment', (done) => {
            chai.request(app)
                .post('/api/v1/assessment/create')
                .set('Authorization', 'Bearer ' + golbalVar.tokens.mentor)
                .send({
                    title: 'Test Assignment',
                    description: 'A test Assignment',
                    deadline: Date.now() + 12*3600*1000
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body._id.should.be.a('string');
                    golbalVar.assessment = res.body._id;
                done();
                });
        });

        it('admin should be able to edit assessment', (done) => {
            chai.request(app)
                .patch(`/api/v1/assessment/${golbalVar.assessment}`)
                .set('Authorization', 'Bearer ' + golbalVar.tokens.admin)
                .send({
                    title: 'Test assignment edited',
                    description: 'A test Assignment',
                    deadline: Date.now() + 12*3600*1000
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.msg.should.be.eql('Success');
                done();
                });
        });

        it('admin should be able to delete assessment', (done) => {
            chai.request(app)
                .delete(`/api/v1/assessment/${golbalVar.assessment}`)
                .set('Authorization', 'Bearer ' + golbalVar.tokens.admin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.msg.should.be.eql('Success');
                done();
                });
        });
    });
});
