const userModel = require('../../src/models/User');

const create = async() =>{
    let tokens = {};
    let doc;
    
    doc = await userModel.create({username: 'test_admin', role:'admin', active:true, password: 'abcd1234', logged_in: true, random: 'abcd'});
    tokens.admin = doc.getJWT('abcd');
    doc = await userModel.create({username: 'test_mentor', role:'mentor', active:true, password: 'abcd1234', logged_in: true, random: 'abcd'});
    tokens.mentor = doc.getJWT('abcd');
    doc = await userModel.create({username: 'test_student', role:'student', active:true, password: 'abcd1234', logged_in: true, random: 'abcd'});
    tokens.student = doc.getJWT('abcd');
    
    return tokens;
};

const createSync = () => {
    let tokens;
    Promise.resolve(create()).then(value=>{
        console.log('d');
        tokens = value;
    }).catch(err=>{
        console.log('err');
        tokens = {};
    });
    while(tokens === undefined);
    return tokens;
};

module.exports = create;
