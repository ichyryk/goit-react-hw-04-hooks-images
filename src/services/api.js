import axios from 'axios';

const fetchPictures = async (pictureName, page) => {
  const BASE_URL = 'https://pixabay.com/api';
  const API_KEY = '22783665-26f30cb64115ee9487502848d';
  const response = await axios.get(
    `${BASE_URL}/?key=${API_KEY}&q=${pictureName}&image_type=photo&page&per_page=12&page=${page}`,
  );
  const hits = await response.data.hits;

  return hits;
};

export default fetchPictures;
