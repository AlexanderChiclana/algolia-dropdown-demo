import { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import algoliasearch from "algoliasearch";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SECRET_KEY);

function App() {
  return (
    <PrimeReactProvider>
      <FullIndexSearch index="majors_dropdown" />
      <FullIndexSearch index="careers_dropdown" />
      <FullIndexSearch index="schools_dropdown" />
      <FullIndexSearch index="career-pathways_dropdown" />
      <FullIndexSearch index="companies_dropdown" />
      <FullIndexSearch index="job-categories_dropdown" />
    </PrimeReactProvider>
  );
}

const FullIndexSearch = (props) => {
  const index = client.initIndex(props.index);
  const [value, setValue] = useState("");
  const [results, setResults] = useState([]);

  // selected item, titles, slugs, and cip codes for majors
  const [selectedItems, setSelectedItems] = useState([]);


  const search = async (event) => {
    const hitsPerPage = 2000;
    let allHits = [];
    let offset = 0;
    let length = 1000;

    try {
      while (true) {
        const res = await index.search(event.query, {
          hitsPerPage: hitsPerPage,
          offset: offset,
          length: length,
          filters: `locale:"en-US"`,
        });

        allHits = [...allHits, ...res.hits];

        if (offset > res.nbHits) {
          break; // Exit the loop when all pages have been fetched
        }

        offset += length;
      }

      setResults(
        allHits.map((hit) => ({
          title: hit.title,
          slug: hit.slug,
          ...(props.index === 'majors_dropdown' && hit.major_cip), // this CIP code is to identify the major
        }))
      );
    } catch (err) {
      console.error("Error during search:", err);
    }
  };

  const handleSelect = (e) => {
    console.log('select')
    console.log(e);
    setSelectedItems([...selectedItems, e.value]);
  }

  const handleUnselect = (e) => {
    console.log('unselect')
    console.log(e);
    setSelectedItems(selectedItems.filter(item => item.slug !== e.value.slug));
  }

  return (
    <>
      <h1 className="text-3xl text-center mt-10">{props.index}</h1>
      <div className="card flex justify-content-center w-full p-16 pt-10">
        <div className="mx-auto">
          <AutoComplete
            value={value}
            field="title"
            suggestions={results}
            completeMethod={search}
            onChange={(e) => setValue(e.value)}
            onSelect={(e) => handleSelect(e)}
            onUnselect={(e) => handleUnselect(e)}
            scrollHeight="500px"
            dropdown
            forceSelection
            autoHighlight
            multiple
            style={{ border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>
      </div>
    </>
  );
};

export default App;
