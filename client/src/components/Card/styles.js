import styled from 'styled-components';

export const StyledCard = styled.div`
  position: relative;
  border-radius: 4.2%;

  button {
    opacity: 0;
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0.5rem 0;
    outline: 0;
    border: 0;

    border-radius: 0 0 10px 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 1rem;

    cursor: pointer;

    transition: opacity 0.2s ease-in;
  }

  &:hover button {
    opacity: 1;
  }
`;
