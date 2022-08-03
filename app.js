const { Party } = require('./models');
const { Contract } = require('./models');
const { Op } = require('sequelize');

const parties = (JSON.parse(
  '[{ "partyId": 1, "lastName": "Taylor", "firstName": "Christopher", "birthDate": "1995-03-05" }, { "partyId": 2, "lastName": "Kelly", "firstName": "Jesse", "birthDate": "1998-07-10" }, { "partyId": 3, "lastName": "Ross", "firstName": "Donald", "birthDate": "1982-06-11" }]'
))

const contracts = (JSON.parse(
  '[{"documentId":"4321","type":"Policy","partyId":1,"documentNumber":"ML-34123-2018","productCode":"MortgageLoan","startDate":"2018-02-09","endDate":"2028-02-08","term":10,"policyYearNum":1},{"documentId":"53123","type":"Policy","partyId":1,"documentNumber":"ENDW-41532-2018","productCode":"Endowment","startDate":"2018-03-18","endDate":"2023-03-17","term":5,"policyYearNum":1},{"documentId":"341","type":"Policy","partyId":1,"documentNumber":"ENDW-12171-2017","productCode":"Endowment","startDate":"2017-09-11","endDate":"2018-09-10","term":1,"policyYearNum":1},{"documentId":"4321","type":"Policy","partyId":2,"documentNumber":"ML-34123-2019","productCode":"MortgageLoan","startDate":"2019-04-14","endDate":"2031-04-13","term":12,"policyYearNum":1},{"documentId":"4321_1","type":"Amendment","partyId":1,"documentNumber":"ML-34123-2018","productCode":"MortgageLoan","startDate":"2018-02-09","endDate":"2028-02-08","term":10,"policyYearNum":2},{"documentId":"4321_2","type":"Amendment","partyId":1,"documentNumber":"ML-34123-2018","productCode":"MortgageLoan","startDate":"2018-02-09","endDate":"2028-02-08","term":10,"policyYearNum":3}]'
)
)
const newParties = parties.map((el) => {
  if (el.firstName === 'Christopher' && el.lastName === 'Taylor') {
    el.birthDate = '08.03.2005'
    return el
  } else {
    return el
  }
})

const actualContracts = contracts.filter((el) => Date.parse(el.endDate) > Date.now())

function createSeeds(value, modelName) {
  return modelName.create(value)
}

Party.bulkCreate(newParties) // ф-ция для самост. созд-я асинхрю запросов: createModelWithSeeds(newParties, Party)
  .then(() => Contract.bulkCreate(actualContracts) // ф. д/самост. запросов: return createModelWithSeeds(actualContracts, Contract)
  )
  .then(() => Contract.increment({
    term: 2,
    endDate: 365 * 2
  }, {
    where: {
      documentId: '53123'
    },
    returning: true,
    plain: true,
  })
  )
  .then((data) => console.log('1. Контракт с увеличенным сроком на 2 года:', data))
  .then(() => Contract.findAll({
      attributes: ['documentId', 'term'],
      where: {
        partyId: 1,
        documentId: {
          [Op.notLike]: '%\\_%'
        }
      },
      raw: true
    })
  )
  .then(data => console.log('2. Все не пролонгации со сроком term:', data))
  .then(() => Contract.findAll({
      where: {
        documentId: {
          [Op.like]: '%' + '\\_' + '%'
        }
      },
      raw: true
    })
  )
  .then(data => console.log('3. Все контракты-пролонгации с постфиксом:', data))
  .then(() => Contract.findAndCountAll({
      attributes: ['Party.firstName', 'Party.lastName'],
      include: {
        model: Party, as: 'Party',
        attributes: []
      },
      where: {
        documentId: {
          [Op.notLike]: '%\\_%'
        },
      },
      raw: true,
    })
  )
  .then(data => console.log('4. Кол-во всех контрактов - не пролонгаций с ИФ контрагентов:', data))

  //  Функция для самостоятельного создания асинхронных запросов в БД:
  // function createModelWithSeeds(arr, modelName) {
  //   return new Promise(async (resolve, reject) => {
  //     for (let i = 0; i < arr.length; i++) {
  //       if (i < arr.length - 1) {
  //         await createSeeds(arr[i], modelName)
  //       } else {
  //         const done = await createSeeds(arr[i], modelName)
  //         if (done) {
  //           resolve(true)
  //         }
  //       }
  //     }
  //   })
  // }
