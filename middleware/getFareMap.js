export const getFareMap = async (flights, findCheap) => {
    console.log('...generating fare map...')
    const carrierInfo = flights.dictionaries.carriers;
    const airlines = new Map();
    const fareMap = new Map();

    for (const [key, value] of Object.entries(carrierInfo)) {
        airlines[key] = value;
    }

    flights.data.map(item => {
        let airline = `${airlines[item.itineraries[0].segments[0].carrierCode]}`;
        let price = `${item.price.currency} ${item.price.grandTotal}`

        if (!fareMap[airline] || ((findCheap) ^ (fareMap[airline] > price))) {
            fareMap[airline] = price;
        }
    });

    return fareMap;
}