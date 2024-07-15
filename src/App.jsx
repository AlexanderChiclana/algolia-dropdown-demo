import { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import algoliasearch from "algoliasearch";
import { PrimeReactProvider, PrimeReactContext } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";

const client = algoliasearch("BFTMIHSJ58", "93801c3bbf559fa76980c51720114a25");
const index = client.initIndex("majors");

function App() {
  const [value, setValue] = useState("");
  const [majors, setMajors] = useState([]);

  const search = async (event) => {
    const hitsPerPage = 2000;
    let page = 0;
    let allHits = [];
    let offset = 0;
    let length = 1000;

    try {
      while (true) {
        const res = await index.search(event.query, {
          hitsPerPage: hitsPerPage,
          // page: page || 0,
          offset: offset,
          length: length,
          filters: `locale:"en-US"`,
        });

        console.log("res:", res);

        // console.log('offset:', offset, 'hitsPerPage:', hitsPerPage);

        const pageCount = Math.ceil(res.nbHits / hitsPerPage);

        // console.log('page:', page, 'pageCount:', pageCount );

        allHits = [...allHits, ...res.hits];

        if (offset > res.nbHits) {
          break; // Exit the loop when all pages have been fetched
        }

        offset += length;
      }

      console.log(allHits);
      setMajors(
        allHits.map((hit) => ({
          title: hit.title,
          slug: hit.slug,
        }))
      );
    } catch (err) {
      console.error("Error during search:", err);
    }
  };

  const handleEvent = (e) => {
    // console.log(e);
    setValue(e.value);
  };

  return (
    <PrimeReactProvider>
      <h1 className="text-3xl text-center mt-10">Majors</h1>
      <div className="card flex justify-content-center w-full p-20 pt-10">
        <div className="mx-auto">
          <AutoComplete
            value={value}
            field="title"
            suggestions={majors}
            completeMethod={search}
            onChange={handleEvent}
            dropdown
            autoHighlight
            style={{ border: "1px solid #ccc", borderRadius: "5px" }}
          />
        </div>
      </div>
    </PrimeReactProvider>
  );
}

export default App;
