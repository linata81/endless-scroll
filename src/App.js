import axios from "axios";
import React, {useState,useEffect} from "react";

function App() {
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); //хранит состояние текущей страницы(тот самый _page)
  const [fetching, setFetching] = useState(true); // принимает true когда мы погружаем данные
  const [totalCount, setTotalCount] = useState(0); //когда кончятся в базе объекты
  
  useEffect(() => {
    if(fetching){
      axios.get(`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage}`)
          .then(responce => {
            setPhotos([...photos, ...responce.data]) //чтобы не перетирать массив с фото, создадим новый куда развернем старые + новые
            setCurrentPage(prevState => prevState + 1)
            setTotalCount(responce.headers['x-total-count'])//в случае успешного запроса получаем из header значение и добавляем в наше состояние
          })
          .finally(() => setFetching(false))
    }
    //eslint-disable-next-line
  },[fetching])
  
  useEffect(() => {
    document.addEventListener('scroll', scrollHandler)
    //если мы вешаем слушатель, особенно на документ, то его надо удалять
    return function() {
      document.removeEventListener('scroll', scrollHandler)
    }
  }, []);
  
/*--- фун-я, которая будет вызываться при скроле стр-цы ---*/ 
  const scrollHandler = (e) => {
    //условие, кот отработает, когда мы дошли до нижнего края стр-цы
    //из общей высоты стр-цы с учетом прокрутки отнимаем сумму видимой области и текущее состояние от верхнего края стр-цы
    if(e.target.documentElement.scrollHeight-(e.target.documentElement.scrollTop + window.innerHeight) < 100 && photos.length < totalCount){
      setFetching(true);
    }
    
    // console.log('scrollHeight', e.target.documentElement.scrollHeight);//общая высота стр-цы с учетом скрола
    // console.log('scrollTop', e.target.documentElement.scrollTop);//текущее положение скрола от верха стр-цы
    // console.log('innerHeight', window.innerHeight);//высота видимой области стр-цы(высота браузера)
    // 2 и 3 параметр в сумме дадут 1(ту самую высоту)
  }
  
  return (
    <div className="App">
      {photos.map(photo => 
        <div className="photo" key={photo.id}>
          <div className="title">{photo.id}. {photo.title}</div>
          <img src={photo.thumbnailUrl} alt="" />
        </div>
      )}
    </div>
  );
}

export default App;
