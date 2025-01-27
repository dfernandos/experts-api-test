import chaiHttp from "chai-http";
import * as chai from "chai";
const should = chai.should();
const expect = chai.expect;
const use = chai.use;

const request = use(chaiHttp).request.execute;

const baseUrl = 'https://your-api-url.com'; 
const endpoint = '/experts'; 

const baseUrlRealApi = 'https://rickandmortyapi.com'; // URL base da API


describe('GET /character/46', () => {
  it('should return the character Bill', async () => {
    try {
      const res = await request(baseUrlRealApi).get('/api/character/46');
      
      // Validações
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body.name).to.equal('Bill');
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error; // Repassa o erro para garantir que o teste falhe corretamente
    }
  });
});



describe('Expert Recency API Tests', () => {

  it('Should validate filtering prior to a year', async () => {
    const res = await request(baseUrl)
      .post(endpoint)
      .send({
        filters: {
          status: [],
          groups: [],
          recency: [">12"]
        }
      });

    // 1. Validate 200 response code
    expect(res.status).to.equal(200);

    // 2. Validate "John Doe" exists as an advisor
    const advisors = res.body.data.map(expert => expert.advisorName);
    expect(advisors).to.include("John Doe");

    // 3. Validate all recency values are >12 months
    res.body.data.forEach(expert => {
      const monthsSinceLastWorked = expert.recency; // Replace with the actual response field
      expect(monthsSinceLastWorked).to.be.greaterThan(12);
    });
  });

  it('Should validate filtering from one year to two', async () => {
    const res = await request(baseUrl)
      .post(endpoint)
      .send({
        filters: {
          status: [],
          groups: [],
          recency: ["[12,24]"]
        }
      });

    // 1. Validate 200 response code
    expect(res.status).to.equal(200);

    // 2. Validate all recency values fall between 12 and 24 months
    res.body.data.forEach(expert => {
      const monthsSinceLastWorked = expert.recency;
      expect(monthsSinceLastWorked).to.be.within(12, 24);
    });
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

    // 1. Validate 200 response code
    expect(res.status).to.equal(200);

    // 2. Validate all recency values are <6 months
    res.body.data.forEach(expert => {
      const monthsSinceLastWorked = expert.recency;
      expect(monthsSinceLastWorked).to.be.lessThan(6);
    });
  });
});
