import 'mocha';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

let app: any;
let server: any;

before(() => {
  app = require('../server/server').app;
  server = require('../server/server').server;
});

after(() => {
  server.close();
});

describe('test function', () => {

  it('should redirect to /login with empty accounts cookie', () => {
    chai.request(app)
      .get('/test')
      .end((err: any, res: any) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.redirectTo('http://' + res.request.host + '/login');
      });
  });

  it('should redirect to /test/u/0 with accounts cookie', () => {
    chai.request(app)
      .get('/test')
      .set('Cookie', 'accounts=[{"email":"aa","position":0,"last_logined_at":1541299047602}];')
      .end((err: any, res: any) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.redirectTo('http://' + res.request.host + '/test/u/0');
      });
  });

});

describe('test_logined function', () => {

  it('should redirect to /login with wrong id', () => {
    chai.request(app)
      .get('/test/u/1')
      .set('Cookie', 'accounts=[{"email":"aa","position":0,"last_logined_at":1541299047602}];')
      .end((err: any, res: any) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.redirectTo('http://' + res.request.host + '/login');
      });
  });

  it('should render test.html with correct id', () => {
    chai.request(app)
      .get('/test/u/0')
      .set('Cookie', 'accounts=[{"email":"aa","position":0,"last_logined_at":1541299047602}];')
      .end((err: any, res: any) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        chai.expect(res.text).to.be.equal('<p>aa 님, 환영합니다.</p>\n<a href="/login">\n  <input type="button" value="계정전환" />\n</a>');
      });
  });

});

describe('create function', () => {

  it('should return duplicated with duplicated email', () => {
    chai.request(app)
      .post('/create')
      .set('Cookie', 'accounts=[{"email":"aa","position":0,"last_logined_at":1541299047602}];')
      .send({ 'email': 'aa' })
      .end((err: any, res: any) => {
        chai.expect(err).to.be.null;
        chai.expect(res.text).to.be.equal('{"status":"duplicated"}');
      });
  });

  it('should return fail with empty email', () => {
    chai.request(app)
      .post('/create')
      .set('Cookie', 'accounts=[{"email":"aa","position":0,"last_logined_at":1541299047602}];')
      .send({ 'email': '' })
      .end((err: any, res: any) => {
        chai.expect(err).to.be.null;
        chai.expect(res.text).to.be.equal('{"status":"fail"}');
      });
  });

  it('should return success with correct email', () => {
    chai.request(app)
      .post('/create')
      .set('Cookie', 'accounts=[{"email":"aa","position":0,"last_logined_at":1541299047602}];')
      .send({ 'email': 'bb' })
      .end((err: any, res: any) => {
        chai.expect(err).to.be.null;
        chai.expect(JSON.parse(res.text).status).to.be.equal('success');
        chai.expect(JSON.parse(res.text).id).to.be.equal(1);
        chai.expect(JSON.stringify(JSON.parse(res.text).accounts[0])).to.be.equal('{"email":"aa","position":0,"last_logined_at":1541299047602}');
        chai.expect(JSON.parse(res.text).accounts[1].email).to.be.equal('bb');
        chai.expect(JSON.parse(res.text).accounts[1].position).to.be.equal(1);
      });
  });

});

