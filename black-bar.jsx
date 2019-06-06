import { css } from "uebersicht"

export const refreshFrequency = 1000000

const style = css`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  background-color: black;
`

export const render = () => {
  return <div className={style}></div>
}