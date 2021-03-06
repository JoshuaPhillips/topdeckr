import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useApolloClient, useQuery } from "@apollo/react-hooks";
import { SEARCH_CARDS, GET_USER_DECKS } from "./graphql";

import SidebarSearchResult from "./SidebarSearchResult";
import Spinner from "../../Spinner";
import Card from "../../Card";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faArrowLeft, faEraser } from "@fortawesome/free-solid-svg-icons";

import { capitalise } from "../../../utils/capitalise";

import {
  StyledDeckManagerSidebar,
  SidebarContainer,
  SidebarListSelectionWrapper,
  OtherDecksContainer,
  SidebarResultsContainer,
  SidebarFormContainer,
  SidebarFormButtonsWrapper
} from "./styles";
import { Button } from "../../../shared/Buttons";
import { TextInput } from "../../../shared/Forms";

const DeckManagerSidebar = props => {
  const {
    deck: { commander, format },
    updateCardListHandler
  } = props;

  const client = useApolloClient();

  const [searchResults, setSearchResults] = useState([]);
  const [selectedList, setSelectedList] = useState("mainDeck");
  const [nameSearch, setNameSearch] = useState("");
  const [loadingResults, setLoadingResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

  const searchCards = async submitEvent => {
    const exactNameMatchPattern = new RegExp(`^${nameSearch}$`, "i");
    submitEvent.preventDefault();

    if (loadingResults) {
      return;
    }

    setLoadingResults(true);

    const { data, errors } = await client.query({
      query: SEARCH_CARDS,
      skip: nameSearch.length < 3,
      variables: {
        searchParams: {
          name: nameSearch,
          ...defaultParams
        }
      }
    });
    if (errors) {
      errors.forEach(error => {
        setLoadingResults(false);
        toast.error(error.message);
      });
    } else {
      const exactMatches = data.searchCards.cards.filter(card => {
        return card.name.match(exactNameMatchPattern) !== null;
      });

      const nonExactMatches = data.searchCards.cards.filter(card => {
        return card.name.match(exactNameMatchPattern) === null;
      });

      setSearchResults([...exactMatches, ...nonExactMatches]);
      setLoadingResults(false);
    }
  };

  const GetUserDecksQueryResponse = useQuery(GET_USER_DECKS, {
    fetchPolicy: "network-only"
  });

  const defaultParams = {
    formats: [
      {
        format: format,
        legality: "legal"
      }
    ]
  };

  if (format === "commander") {
    defaultParams.commander = commander.color_identity;
  }

  return (
    <StyledDeckManagerSidebar>
      <SidebarContainer>
        <div>
          <form style={{ display: "flex" }} onSubmit={e => searchCards(e)}>
            <TextInput
              type='text'
              placeholder='Search for a card...'
              value={nameSearch}
              onChange={e => setNameSearch(e.target.value)}
            />
            <Button type='submit' disabled={nameSearch.length < 3}>
              <FontAwesomeIcon icon={faSearch} fixedWidth />
            </Button>
          </form>
          {format !== "commander" && (
            <SidebarListSelectionWrapper>
              <button type='button' disabled={selectedList === "mainDeck"} onClick={() => setSelectedList("mainDeck")}>
                Main Deck
              </button>
              <button
                type='button'
                disabled={selectedList === "sideboard"}
                onClick={() => setSelectedList("sideboard")}>
                Sideboard
              </button>
            </SidebarListSelectionWrapper>
          )}
        </div>
        <SidebarResultsContainer>
          {selectedResult ? (
            <Card card={selectedResult} />
          ) : searchResults.length === 0 ? (
            <>
              <h1>Search for a card name above.</h1>
              <p>Only cards that match your deck's format (and commander if there is one) will be shown.</p>
            </>
          ) : (
            <>
              {loadingResults ? (
                <Spinner />
              ) : (
                searchResults.length !== 0 && (
                  <>
                    {searchResults.map(result => {
                      return (
                        <SidebarSearchResult
                          key={result.scryfall_id}
                          deck={props.deck}
                          card={result}
                          list={selectedList}
                          addCardHandler={updateCardListHandler}
                          selectResult={setSelectedResult}
                        />
                      );
                    })}
                  </>
                )
              )}
            </>
          )}
        </SidebarResultsContainer>
        <SidebarFormContainer>
          <SidebarFormButtonsWrapper>
            {searchResults.length !== 0 &&
              (selectedResult ? (
                <Button type='button' onClick={() => setSelectedResult(null)}>
                  <FontAwesomeIcon icon={faArrowLeft} fixedWidth />
                  Back
                </Button>
              ) : (
                <Button
                  type='button'
                  onClick={() => {
                    setNameSearch("");
                    setSelectedResult(null);
                    setSearchResults([]);
                  }}>
                  <FontAwesomeIcon icon={faEraser} fixedWidth />
                  Clear
                </Button>
              ))}
          </SidebarFormButtonsWrapper>
        </SidebarFormContainer>
      </SidebarContainer>

      <OtherDecksContainer>
        {GetUserDecksQueryResponse.loading && <Spinner />}
        {GetUserDecksQueryResponse.data && (
          <div>
            {GetUserDecksQueryResponse.data.getCurrentUser.decks.map(deck => {
              return (
                <Link key={deck.id} to={`/decks/${deck.id}`}>
                  <p key={deck.id}>
                    {deck.name} ({capitalise(deck.format)})
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </OtherDecksContainer>
    </StyledDeckManagerSidebar>
  );
};

export default DeckManagerSidebar;
