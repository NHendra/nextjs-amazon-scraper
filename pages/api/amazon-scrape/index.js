const AmazonScraper = require('./Amazon');
const { geo, defaultItemLimit } = require('./constant');

const INIT_OPTIONS = {
    bulk: true,
    number: defaultItemLimit,
    filetype: '',
    rating: [1, 5],
    page: 1,
    category: '',
    cookie: '',
    asyncTasks: 5,
    sponsored: false,
    cli: false,
    sort: false,
    discount: false,
    reviewFilter: {
        // Sort by recent/top reviews
        sortBy: 'recent',
        // Show only reviews with verified purchase
        verifiedPurchaseOnly: false,
        // Show only reviews with specific rating or positive/critical
        filterByStar: '',
        formatType: 'all_formats',
    },
};

const products = async (options) => {
    options = { ...INIT_OPTIONS, ...options };
    options.geo = geo[options.country] ? geo[options.country] : geo['US'];
    options.scrapeType = 'products';
    if (!options.bulk) {
        options.asyncTasks = 1;
    }
    try {
        const data = await new AmazonScraper(options).startScraper();
        return data;
    } catch (error) {
        throw error;
    }
};

const reviews = async (options) => {
    options = { ...INIT_OPTIONS, ...options };
    options.geo = geo[options.country] ? geo[options.country] : geo['US'];
    options.scrapeType = 'reviews';
    if (!options.bulk) {
        options.asyncTasks = 1;
    }
    try {
        const data = await new AmazonScraper(options).startScraper();
        return data;
    } catch (error) {
        throw error;
    }
};

const asin = async (options) => {
    options = { ...INIT_OPTIONS, ...options };
    options.geo = geo[options.country] ? geo[options.country] : geo['US'];
    options.scrapeType = 'asin';
    options.asyncTasks = 1;
    try {
        const data = await new AmazonScraper(options).startScraper();
        return data;
    } catch (error) {
        throw error;
    }
};

const categories = async (options) => {
    options = { ...INIT_OPTIONS, ...options };
    options.geo = geo[options.country] ? geo[options.country] : geo['US'];
    try {
        const data = await new AmazonScraper(options).extractCategories();
        return data;
    } catch (error) {
        throw error;
    }
};

const countries = async () => {
    const output = [];
    for (let item in geo) {
        output.push({
            country: geo[item].country,
            country_code: item,
            currency: geo[item].currency,
            host: geo[item].host,
        });
    }
    return output;
};

export default function handler(req, res) {

  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const options = req.query;

  if (!options.type) {
    res.status(405).send({ message: '"type" param needed. ex: products, reviews, asin, categories, countries' })
    return
  }

  if (options.type == 'products') {
    products(options)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).send({ message: 'Error fetching products', error: error.message }));
  } else if (options.type == 'reviews') {
    reviews(options)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).send({ message: 'Error fetching reviews', error: error.message }));
  } else if (options.type == 'asin') {
    asin(options)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).send({ message: 'Error fetching asin', error: error.message }));
  } else if (options.type == 'categories') {
    categories(options)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).send({ message: 'Error fetching categories', error: error.message }));
  } else if (options.type == 'countries') {
    countries(options)
    .then(data => res.status(200).json(data))
    .catch(error => res.status(500).send({ message: 'Error fetching countries', error: error.message }));
  } else {
    res.status(405).send({ message: 'Wrong type key' })
  }
}

