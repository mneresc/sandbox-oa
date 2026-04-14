import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';

describe('Main endpoints + health + sse', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('health', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
  });

  it('repositories and components', async () => {
    await request(app.getHttpServer()).post('/repositories').send({ id: 'r1' }).expect(201);
    await request(app.getHttpServer()).post('/components').send({ id: 'c1' }).expect(201);
  });

  it('env mapping/render', async () => {
    const d = await request(app.getHttpServer()).post('/env/discovery').send({ content: 'A=1' });
    expect(d.body.vars).toEqual(['A']);
  });

  it('sse endpoint exists', async () => {
    const res = await request(app.getHttpServer()).get('/sandbox/stream');
    expect([200, 206]).toContain(res.status);
  });
});
