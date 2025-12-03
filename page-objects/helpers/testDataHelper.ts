import { faker } from '@faker-js/faker';

export class TestDataHelper {
    static fullName() {
        return faker.person.fullName();

        //Using Faker to generate a random full name with the last name fixed as 'Test'.
        //return faker.person.fullName({ lastName: 'Test' });
    }

    static emailFromName(name: string) {
        // Create a unique test email by removing spaces from the name and adding a random number
        return `${name.replace(' ', '')}${faker.number.int(1000)}@test.com`;
    }

    static strongPassword() {
        const base = faker.internet.password({ length: 10 });
        const symbol = faker.string.symbol();
        const number = faker.number.int(9);

        return `${base}${symbol}${number}`;
    }

}
