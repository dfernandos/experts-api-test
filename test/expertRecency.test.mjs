import sinon from "sinon";
import chaiHttp from "chai-http";
import * as chai from "chai";
const expect = chai.expect;
const use = chai.use;

const request = use(chaiHttp).request.execute;

const baseUrl = 'https://https://www.alphasights.com/projects';
const endpoint = '/experts';

describe('Expert Recency API Tests', () => {
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  after(() => {
    sandbox.restore();
  });

  it('Should validate filtering prior to a year', async () => {
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

    console.log("Response Body:", res.body);

    expect(res.status).to.equal(200);
    const advisors = res.body.data?.map(expert => expert.advisorName);
    expect(advisors).to.include("John Doe");
    res.body.data.forEach(expert => {
      expect(expert.recency).to.be.greaterThan(12);
    });

    postStub.restore();
  });

  it('Should validate filtering from one year to two', async () => {
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


  it('Should validate filtering from now to 6 months', async () => {
    const res = await request(baseUrl)
      .post(endpoint)
      .send({
        filters: {
          status: [],
          groups: [],
          recency: ["<6"]
        }
      });

    expect(res.status).to.equal(200);

    res.body.data.forEach(expert => {
      const monthsSinceLastWorked = expert.recency;
      expect(monthsSinceLastWorked).to.be.lessThan(6);
    });
  });
});
