import React from 'react';
import GalleryModeCardItem from './GalleryModeCardItem';

import { StyledGalleryModeContainer, GalleryModeCardListContainer } from './styles';
import { SubSectionHeader } from '../../../../shared/Headers';

const GalleryModeContainer = props => {
  const { deck, mainDeckList, sideboardList, currentUserOwnsDeck, updateCardListHandler } = props;

  let totalMainDeckCount = deck.format === 'commander' ? 1 : 0;
  let totalSideboardCount = 0;

  mainDeckList.forEach(({ mainDeckCount }) => {
    totalMainDeckCount += mainDeckCount;
  });

  sideboardList.forEach(({ sideboardCount }) => {
    totalSideboardCount += sideboardCount;
  });

  return (
    <StyledGalleryModeContainer>
      <SubSectionHeader>
        Main Deck ({totalMainDeckCount} / {deck.format === 'commander' ? 100 : 60})
      </SubSectionHeader>

      <GalleryModeCardListContainer>
        {deck.format === 'commander' && (
          <GalleryModeCardItem
            cardWithCounts={{ card: deck.commander, mainDeckCount: 1, sideboardCount: 0 }}
            deck={deck}
            type={'commander'}
            currentUserOwnsDeck={currentUserOwnsDeck}
          />
        )}
        {mainDeckList.map(cardWithCounts => {
          return (
            <GalleryModeCardItem
              key={cardWithCounts.card.scryfall_id}
              cardWithCounts={cardWithCounts}
              deck={deck}
              type={'mainDeck'}
              totalMainDeckCount={totalMainDeckCount}
              totalSideboardCount={totalSideboardCount}
              updateCardListHandler={updateCardListHandler}
              currentUserOwnsDeck={currentUserOwnsDeck}
            />
          );
        })}
      </GalleryModeCardListContainer>

      {deck.format !== 'commander' && (
        <React.Fragment>
          <h1>Sideboard ({totalSideboardCount} / 15)</h1>
          <GalleryModeCardListContainer>
            {sideboardList.map(cardWithCounts => {
              return (
                <GalleryModeCardItem
                  key={cardWithCounts.card.scryfall_id}
                  cardWithCounts={cardWithCounts}
                  deck={deck}
                  type={'sideboard'}
                  totalMainDeckCount={totalMainDeckCount}
                  totalSideboardCount={totalSideboardCount}
                  updateCardListHandler={updateCardListHandler}
                  currentUserOwnsDeck={currentUserOwnsDeck}
                />
              );
            })}
          </GalleryModeCardListContainer>
        </React.Fragment>
      )}
    </StyledGalleryModeContainer>
  );
};

export default GalleryModeContainer;
