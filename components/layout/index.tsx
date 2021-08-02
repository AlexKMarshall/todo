import styled from 'styled-components'

export const Center = styled.div`
  box-sizing: content-box;
  max-width: var(--measure);
  width: 100%;
  margin-left: auto;
  margin-right: auto;
`

export const Cover = styled.div`
  isolation: isolate;
  --gutter: var(--s2);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: var(--gutter);

  & > * {
    margin-top: var(--gutter);
    margin-bottom: var(--gutter);
  }

  & > :first-child {
    margin-top: 0;
  }

  & > :last-child {
    margin-bottom: 0;
  }
`

export const CoverInner = styled.div`
  margin-top: auto;
  margin-bottom: auto;
`
