let app = require('../../src/app');
let userModel = require('../../src/models/User');
let assesmentModel = require('../../src/models/Assessment');
let submissionModel = require('../../src/models/Submission')
let createAccount = require('../utils/create-account');
let chai = require('chai');
let chaiHttp = require('chai-http');
let crypto = require('crypto');
chai.use(chaiHttp);

let golbalVar = {};

let createAssesment = async () =>{
    let mentor = await userModel.findOne({role:'mentor'});
    let doc = await assesmentModel.create({title: 'AAA', description: 'BBB', mentor: mentor._id, deadline: Date.now()+3600000});
    return doc._id;
}

module.exports = describe('Submission', () => {
    before((done) => {
        userModel.deleteMany({}, (err) => {
            Promise.resolve(createAccount()).then(tokens=>{
                golbalVar.tokens = tokens;
                return createAssesment();
            }).then(assesment=>{
                golbalVar.assesment = assesment;
            }).finally(()=>{
                done();
            });
        });      
    });
    
    after((done) => {
        userModel.deleteMany({}, (err) => {           
        });
        submissionModel.deleteMany({},(err)=>{
        });
        assesmentModel.deleteMany({}, (err) => { 
            done();           
        });
    });

    describe('View/Edit/Delete', () => {
        it('student shound able to submit assesment submission', (done) => {
            let boundary = crypto.randomBytes(8).toString('hex');
            chai.request(app)
                .post(`/api/v1/submission/submit/${golbalVar.assesment}`)
                .set('Authorization', 'Bearer ' + golbalVar.tokens.student)
                .set('Content-Type', 'multipart/form-data; boundary=' + boundary)
                .send('--' + boundary + '\r\n')
                .send('Content-Disposition: form-data; name="link"\r\n\r\n')
                .send('http://example.com')
                .send('\r\n--' + boundary + '--')
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.msg.should.be.eql('Submission received');
                    done();
                });
        });

        it('mentor shound able to view submission', (done) => {
            let boundary = crypto.randomBytes(8).toString('hex');
            chai.request(app)
                .get(`/api/v1/submission`)
                .set('Authorization', 'Bearer ' + golbalVar.tokens.mentor)
                .send({
                    mark: 100,
                    remarks: 'Good'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    golbalVar.submission_id = res.body[0]._id;
                    done();
                });
        });

        it('mentor shound able to grade submission', (done) => {
            let boundary = crypto.randomBytes(8).toString('hex');
            chai.request(app)
                .post(`/api/v1/submission/${golbalVar.submission_id}/grade`)
                .set('Authorization', 'Bearer ' + golbalVar.tokens.mentor)
                .send({
                    mark: 100,
                    remarks: 'Good'
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.msg.should.be.eql('Success');
                    done();
                });
        });

        it('admin shound able to edit grade', (done) => {
            let boundary = crypto.randomBytes(8).toString('hex');
            chai.request(app)
                .patch(`/api/v1/submission/${golbalVar.submission_id}/grade`)
                .set('Authorization', 'Bearer ' + golbalVar.tokens.admin)
                .send({
                    mark: 10,
                    remarks: 'Bad'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.msg.should.be.eql('Success');
                    done();
                });
        });

        it('admin shound able to delete grade', (done) => {
            let boundary = crypto.randomBytes(8).toString('hex');
            chai.request(app)
                .delete(`/api/v1/submission/${golbalVar.submission_id}/grade`)
                .set('Authorization', 'Bearer ' + golbalVar.tokens.admin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.msg.should.be.eql('Success');
                    done();
                });
        });

        it('admin shound able to edit submission', (done) => {
            let boundary = crypto.randomBytes(8).toString('hex');
            chai.request(app)
                .patch(`/api/v1/submission/${golbalVar.submission_id}`)
                .set('Authorization', 'Bearer ' + golbalVar.tokens.admin)
                .set('Content-Type', 'multipart/form-data; boundary=' + boundary)
                .send('--' + boundary + '\r\n')
                .send('Content-Disposition: form-data; name="link"\r\n\r\n')
                .send('http://example.org')
                .send('\r\n--' + boundary + '--')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.msg.should.be.eql('Success');
                    done();
                });
        });

        it('admin shound able to delete submission', (done) => {
            let boundary = crypto.randomBytes(8).toString('hex');
            chai.request(app)
                .delete(`/api/v1/submission/${golbalVar.submission_id}`)
                .set('Authorization', 'Bearer ' + golbalVar.tokens.admin)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.msg.should.be.eql('Success');
                    done();
                });
        });
    });
});
