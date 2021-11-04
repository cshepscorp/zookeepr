const fs = require('fs');
const {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper,
} = require('../lib/zookeepers.js');

const { zookeepers } = require('../data/zookeepers');

// so we dont add any test data to our zookeepers.json
jest.mock('fs');

test("creates a zookeeper", () => {
    const zookeeper = createNewZookeeper({ name: 'Kim', id: '0' }, zookeepers);

    expect(zookeeper.name).toBe('Kim');
    expect(zookeeper.id).toBe('0');
});

test("find by ID", () => {
    const startingZookeepers = [
        {
            id: "0",
            name: "Kim",
            age: 28,
            favoriteAnimal: "dolphin"
        },
        {
            id: "1",
            name: "Raksha",
            age: 31,
            favoriteAnimal: "penguin"
        },
    ];

    const result = findById("0", startingZookeepers);

    expect(result.name).toBe("Kim");
});

test('validates zookeeper favorite animal', () => {
    const zookeeperFave = 
        {
            id: "0",
            name: "Kim",
            age: 28,
            favoriteAnimal: "dolphin"
        };
    const zookeeperFaveInvalid = 
        {
            id: "0",
            name: "Kim",
            age: 28,
        };
    
        const result1 = validateZookeeper(zookeeperFave);
        const result2 = validateZookeeper(zookeeperFaveInvalid);

        expect(result1).toBe(true);
        expect(result2).toBe(false);

})

test('filter by query', () => {
    const startingZookeepers = [
        {
            id: "0",
            name: "Kim",
            age: 28,
            favoriteAnimal: "dolphin"
        },
        {
            id: "1",
            name: "Raksha",
            age: 28,
            favoriteAnimal: "penguin"
        },
    ];

    const updatedZookeepers = filterByQuery({ age: 28 }, startingZookeepers);

    expect(updatedZookeepers.length).toEqual(2);    
    
})