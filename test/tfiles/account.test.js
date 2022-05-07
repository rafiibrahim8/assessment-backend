let app = require('../../src/app');
let userModel = require('../../src/models/User');
let chai = require('chai');
let chaiHttp = require('chai-http');
chai.use(chaiHttp);

let golbalVar = {};

module.exports = describe('Account', () => {
    before((done) => {
        userModel.deleteMany({}, (err) => { 
            done();           
        });        
    });

    after((done) => {
        userModel.deleteMany({}, (err) => { 
            done();           
        });        
    });

    describe('Signup', () => {
        it('should not signup a admin', (done) => {
            chai.request(app)
                .post('/api/v1/account/signup')
                .send({
                    username: 'test_admin',
                    role: 'admin',
                    password: 'admin1234'
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.eql('Admin account creation is not allowed');
                done();
                });
        });

        it('should signup a mentor', (done) => {
            chai.request(app)
                .post('/api/v1/account/signup')
                .send({
                    username: 'test_mentor',
                    role: 'mentor',
                    password: 'world1234'
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.eql('Account created');
                done();
                });
        });

        it('should signup a student', (done) => {
            chai.request(app)
                .post('/api/v1/account/signup')
                .send({
                    username: 'test_student',
                    role: 'student',
                    password: 'hello1234'
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.eql('Account created');
                done();
                });
        });

    });

    describe('Login', () => {
        it('should login student', (done) => {
            chai.request(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'test_student',
                    password: 'hello1234'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.token.should.be.a('string');
                    golbalVar.token = res.body.token;
                    done();
                });
        });

        it('should not login metor (account not activated by admin)', (done) => {
            chai.request(app)
                .post('/api/v1/account/login')
                .send({
                    username: 'test_mentor',
                    password: 'world1234'
                })
                .end((err, res) => {
                    res.should.have.status(403);
                    res.body.should.be.a('object');
                    res.body.msg.should.be.eql('User deactivated');
                    done();
                });
        });

        it('should view userinfo', done=>{
            chai.request(app)
            .get('/api/v1/account/me')
            .set('Authorization', 'Bearer ' + golbalVar.token)
            .end((err, res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.username.should.be.eql('test_student');
                done();
            });
        });
    });
});
