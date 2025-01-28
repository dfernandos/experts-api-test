import sinon from "sinon";
import chaiHttp from "chai-http";
import * as chai from "chai";
const should = chai.should();
const expect = chai.expect;
const use = chai.use;

const request = use(chaiHttp).request.execute;

const baseUrl = 'https://your-api-url.com';
const endpoint = '/experts';

describe('Expert Recency API Tests', () => {
  let sandbox;

  before(() => {
    // Create a Sinon sandbox
    sandbox = sinon.createSandbox();
  });

  after(() => {
    // Restore all stubs and mocks
    sandbox.restore();
  });

  it('Should validate filtering prior to a year', async () => {
    // Mock the HTTP request using Sinon
    const postStub = sandbox.stub(request(baseUrl), 'post').resolves({
      status: 200,
      body: {
        data: [
          { advisorName: "John Doe", recency: 15 },
          { advisorName: "Jane Smith", recency: 18 },
        ],
      },
    });

    const res = await request(baseUrl).post(endpoint).send({
      filters: {
        status: [],
        groups: [],
        recency: [">12"],
      },
    });

    // check if the mock works
    console.log("Response Body:", res.body);

    // Validations
    expect(res.status).to.equal(200);
    const advisors = res.body.data.map(expert => expert.advisorName);
    expect(advisors).to.include("John Doe");
    res.body.data.forEach(expert => {
      expect(expert.recency).to.be.greaterThan(12);
    });

    postStub.restore();
  });

  it('Should validate filtering from one year to two', async () => {
    // Mock a different response for this test
    const postStub = sandbox.stub(request(baseUrl), 'post').resolves({
      status: 200,
      body: {
        data: [
          { advisorName: "John Doe", recency: 14 },
          { advisorName: "Jane Smith", recency: 22 },
        ],
      },
    });

    const res = await request(baseUrl).post(endpoint).send({
      filters: {
        status: [],
        groups: [],
        recency: ["[12,24]"],
      },
    });

    expect(res.status).to.equal(200);
    res.body.data.forEach(expert => {
      expect(expert.recency).to.be.within(12, 24);
    });
    postStub.restore();
  });


  // it('Should validate filtering from now to 6 months', async () => {
  //   const res = await request(baseUrl)
  //     .post(endpoint)
  //     .send({
  //       filters: {
  //         status: [],
  //         groups: [],
  //         recency: ["<6"]
  //       }
  //     });

  //   // 1. Validate 200 response code
  //   expect(res.status).to.equal(200);

  //   // 2. Validate all recency values are <6 months
  //   res.body.data.forEach(expert => {
  //     const monthsSinceLastWorked = expert.recency;
  //     expect(monthsSinceLastWorked).to.be.lessThan(6);
  //   });
  // });

  // describe('GET /character/46', () => {
//   it('should return the character Bill', async () => {
//     try {
//       const res = await request(baseUrlRealApi).get('/api/character/46');
      
//       // Validações
//       expect(res).to.have.status(200);
//       expect(res.body).to.be.an('object');
//       expect(res.body.name).to.equal('Bill');
//     } catch (error) {
//       console.error('Erro na requisição:', error);
//       throw error; // Repassa o erro para garantir que o teste falhe corretamente
//     }
//   });
// });
});
