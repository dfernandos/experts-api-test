import chaiHttp from "chai-http";
import * as chai from "chai";
const expect = chai.expect;
const use = chai.use;

const request = use(chaiHttp).request.execute;

const baseUrl = 'localhost:3000';
const endpoint = '/experts';

describe('Expert Recency API Tests', () => {

  it('Filter experts within the last 6 months recency', async () => {
    try {
      const res = await request(baseUrl)
        .post(endpoint)
        .send({
          "filters": {
            "status": [],
            "groups": [],
            "recency": ["<6"]
          }
        });

      console.log("response -> ", res.body);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('experts').that.is.an('array');

      const hasExpert = res.body.experts.some(expert => expert.advisorName === 'Daniel Oliveira');
      expect(hasExpert).to.be.true;

    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  });

  it('Filter experts more than 12 months recency', async () => {
    try {
      const res = await request(baseUrl)
        .post(endpoint)
        .send({
          "filters": {
            "status": [],
            "groups": [],
            "recency": [">12"]
          }
        });

      console.log("response -> ", res.body);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('experts').that.is.an('array');
      expect(res.body.experts).to.have.lengthOf(3);

    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  });

  it('Filter experts between 12 and 24 months recency', async () => {
    try {
      const res = await request(baseUrl)
        .post(endpoint)
        .send({
          "filters": {
            "status": [],
            "groups": [],
            "recency": ["[12,24]"]
          }
        });

      console.log("response -> ", res.body);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('experts').that.is.an('array');
      expect(res.body.experts).to.have.lengthOf(1);

    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  });

  it('John Doe exists as an “advisorName” value in the response data', async () => {
    try {
      const res = await request("http://localhost:3000")
      .post('/all-experts')
        .send({});

      console.log("response -> ", res.body);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('experts').that.is.an('array');

      const hasAliceJohnson = res.body.experts.some(expert => expert.advisorName === 'John Doe');
      expect(hasAliceJohnson).to.be.true;

    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  });

});