
import { useState, useRef, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import "./App.css";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import algoliasearch from "algoliasearch";
import { PrimeReactProvider, PrimeReactContext } from 'primereact/api';
import "primereact/resources/themes/lara-light-cyan/theme.css";

const client = 
const index = client.initIndex("schools");

function App() {
  const [value, setValue] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [items, setItems] = useState([]);
  const [majors, setMajors] = useState([]);
  const [slugs, setSlugs] = useState([]);
  const [fullMajors, setFullMajors] = useState([]);

  const search = (event) => {

    const searchRecursive = (page = 0, allHits = []) => {
      index
        .search(event.query, {
          hitsPerPage: 1000,
          page: page,
          filters: `locale:en-US`,
        })
        .then(({ hits, nbPages }) => {
          const combinedHits = [...allHits, ...hits];
          if (page < nbPages - 1) {
            searchRecursive(page + 1, combinedHits);
          } else {
            console.log(combinedHits);
            setMajors(combinedHits.map((hit) => hit.title));
            setSlugs(combinedHits.map((hit) => hit.slug));
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };
  
    searchRecursive();
  };

  // useEffect(() => {
  //   if (value === "") {
  //     console.log('empty value');
  //     index
  //       .search("", {
  //         hitsPerPage: 1000,
  //         filters: `locale:en-US`,
  //       })
  //       .then(({ hits }) => {
  //         console.log(hits);
  //         setMajors(hits.map((hit) => hit.title));
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // }, [value]);

  const handleEvent = (e) => {
    console.log(e)
    setValue(e.value)
  }

  return (
    <PrimeReactProvider>

    <div className="card flex justify-content-center w-full p-20">
      <div className="mx-auto">
      <AutoComplete
        value={value}
        suggestions={majors}
        completeMethod={search}
        onChange={handleEvent}
        dropdown
        autoHighlight
        style={{border: '1px solid #ccc', borderRadius: '5px'}}
      />
      </div>

    </div>
    </PrimeReactProvider>
  );
}

export default App;
