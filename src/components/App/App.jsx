import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from '../Container/Container';
import SearchBar from '../SearchBar/SearchBar';
import ImageGallery from '../ImageGallery/ImageGallery';
import Modal from '../Modal/Modal';
import { Button } from '../Button/Button';
import { GalleryLoader } from '../Loader/Loader';
import { onErrorToast } from 'components/ToastError';
import fetchPictures from 'services/api';


const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export default function App() {
  const [pictureName, setPictureName] = useState();
  const [pictures, setPictures] = useState([]);
  const [status, setStatus] = useState(Status.IDLE);
  const [page, setPage] = useState(1);
  const [largeImageURL, setLargeImageURL] = useState(null);
  const [imgTags, setImgTags] = useState('');
  const [loader, setLoader] = useState(false);

  const onModalClose = () => { 
    setLargeImageURL(null);
  }

  const handleFormSubmit = pictureName => {
    if (pictureName.trim() === '') { 
      onErrorToast()
      return;
    }

     resetState() 

    setPictureName(pictureName );
  };

  const handleImageClick = (largeImageURL, imgTags) => {
    setLargeImageURL(largeImageURL);
    setImgTags(imgTags);
    setLoader(true);
  };

  function resetState() {
    setPictureName(null)
    setPage(1)
    setPictures([])
  }

  const onLoadMoreBtn = () => {
   setPage((page) => page + 1)
  };

  useEffect(() => {
    if (!pictureName) { 
      return
    }
    setStatus(Status.PENDING);

    async function onFetchPictures() {
      try {
        const pictures = await fetchPictures(pictureName, page)

        if (pictures.length === 0) {
          throw new Error()
        }

        setPictures((state) => [...state, ...pictures])
        setStatus(Status.RESOLVED)
      } catch (error) {
        setStatus(Status.REJECTED)
        onErrorToast()
      }
    }

    setTimeout(() => {
      onFetchPictures()
    }, 500)
   
  }, [page, pictureName])

  useEffect(() => {
    function scrollPageToEnd() { 
      setTimeout(() => { 
        window.scrollBy({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        })
      }, 1000)
    }

    if (page > 1) {
      scrollPageToEnd();
    }
  }, [pictures, page])

  const showImageList = pictures.length > 0

    return (
      <Container>
        <ToastContainer autoClose={4000} />
        <SearchBar onSubmit={handleFormSubmit} />
        {status === Status.IDLE && (
          <>
            <h2>Waiting for pictures...</h2>
          </>
        )}
        {status === Status.PENDING && <GalleryLoader />}
      
        <ImageGallery
          pictures={pictures}
          handleImageClick={handleImageClick}
        />
        {showImageList && status === Status.RESOLVED && (<Button onClick={onLoadMoreBtn} aria-label="add contact" />)}

        {largeImageURL && (
          <Modal onClose={onModalClose}>
            <img src={largeImageURL} alt={imgTags} />
          </Modal>
        )}
      </Container>
    );
  }

