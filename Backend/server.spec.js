const request = require('supertest');
// const server = require('express')()
const server = require('./api/routes/users.js')



describe('server.js', () => {
    // http calls made with supertest return promises, we can use async/await if desired
    describe('index route', () => {
      it('should return an OK status code from the index route', async () => {
        const expectedStatusCode = 200;

        const response = await request(server).get('/');
        // .then(response => {
            expect(response.status).toEqual(expectedStatusCode);
        })
        it("should return App is currently functioning", async () => {
            const response = await request(server).get('/'); 
            expect(response.type).toEqual('application/json');
        });
        it('should return a JSON object fron the index route', async () => {
            const expectedBody =  'App is currently functioning' ;
      
            const response = await request(server).get('/');
      
            expect(response.body).toEqual(expectedBody);
          });
        //   it('should return an OK status code freom reg', async () => {
        //     const expectedStatusCode = 500;
        //     const credentials = {
        //         username: "username",
        //         password: "hash",
        //         email: "email",
        //         name: "name",
        //         phone: "phone",
        //         logo: "logo",
        //         paid: 0
        //       };
    
        //     const response = await request(server).post('/register');
            
        //         expect(response.status).toEqual(expectedStatusCode);
        //     })
      });
     
       
        //   it("should return App is currently functioning", async () => {
        //       const expect = { token: token, userId: user.id, status: credentials.paid }
        //       const response = await request(server).post('/register',{
                
        //             username: Frank,
        //             password: appl123,
        //             email: aolaol.com
                
        //       }); 
        //       expect(response.body).toEqual('application/json');
        //   });
    
    //     describe('Post/ greet',() => {
    //     it('should return code', async () => {

        
     
    //     const expected = {name:"sam"};
    //     const response = await request(server).post('/greet')
    //     .send('name=john')
    //         // "password":"Apple123123",
    //         // "email":"aol@aol.com"
            
        


    //     expect(response.body).toEqual(expected)
    //  }) 
    // }) 
        
    })
  
    describe('POST /greet', function() {
        it('responds with json', async () => {
          request(server)
            .post('/greet')
            .send({name: 'john'})
            // .set('Accept', 'application/json')
            .expect(response.body)
            
        });
      });