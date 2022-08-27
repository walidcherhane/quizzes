import { Fragment, useEffect, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import Questions from "./Questions";

function App() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [selected, setSelected] = useState(cats[0]!);
  const [start, setStart] = useState(false);
  const [query, setQuery] = useState("");

  const filteredPeople =
    query === ""
      ? cats
      : cats.filter((cat) =>
          cat.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  useEffect(() => {
    const fetchCAts = async () => {
      const response = await fetch("https://opentdb.com/api_category.php");
      const data = (await response.json()) as {
        trivia_categories: Cat[];
      };
      setCats(data.trivia_categories);
      setSelected(data.trivia_categories[0]);
    };
    fetchCAts();
  }, []);

  if (!cats?.length) return <div>Loading...</div>;

  if (start && selected) {
    return <Questions Cat={selected} />;
  }
  return (
    <>
      <div className="h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
        <div className="container mx-auto">
          <div className="flex flex-col justify-center items-center h-screen">
            <div className="mt-10 flex gap-4 items-center justify-center">
              <Combobox value={selected} onChange={setSelected}>
                <div className="relative  ">
                  <Combobox.Input
                    displayValue={(cat: Cat) => cat.name}
                    onChange={(event) => setQuery(event.target.value)}
                    className="relative w-full text-xl cursor-default rounded bg-white border border-indigo-500 py-3 px-6 pr-10 min-w-[200px]"
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>

                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-200"
                    leaveFrom="opacity-100 transform translate-y-0"
                    leaveTo="opacity-0 -translate-y-28"
                  >
                    <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {filteredPeople.length === 0 && query !== "" ? (
                        <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                          Nothing found.
                        </div>
                      ) : (
                        filteredPeople?.map((cat, i) => (
                          <Combobox.Option
                            key={i}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active
                                  ? "bg-indigo-200 text-indigo-900"
                                  : "text-gray-900"
                              }`
                            }
                            value={cat}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block text-sm text-gray-500  
                              ${selected ? "font-medium" : "font-normal"}`}
                                >
                                  {cat.name}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600 ">
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Combobox.Option>
                        ))
                      )}
                    </Combobox.Options>
                  </Transition>
                </div>
              </Combobox>
              <button
                onClick={() => setStart(true)}
                className="inline-block bg-white px-8 py-3 text-sm font-medium text-indigo-600 transition border border-indigo-500 rounded hover:scale-110 hover:shadow-xl active:text-indigo-500 "
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
