export default (title, detailArr) => {
  if (title || detailArr) {
    let lis = '';
    if (detailArr) {
      detailArr.forEach(subTooltip => {
        if (subTooltip[1] !== 'undefined' && subTooltip[1]) {
          lis += '<li style="font-size: 12px;list-style-type: none; word-wrap: break-word; word-break: normal;"><span>' + subTooltip[0] + '</span>' + subTooltip[1] + '</li>';
        }
      });
      if (!title && lis === '') {
        return null;
      }
      return `
      <div class="g6-tooltip" style="
                position: absolute;
                white-space: nowrap;
                zIndex: 8;
                transition: visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1), left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                background-color: rgba(255, 255, 255, 0.9);
                box-shadow: 0px 0px 10px #aeaeae;
                border-radius: 3px;
                color: rgb(87, 87, 87);
                line-height: 20px;
                padding: 10px 10px 6px 10px;
              ">
                <h4 class="g6-tooltip-title" style="
                  margin: 0;
                ">${title}</h4>
                <ul class="g6-tooltip-list" style="
                  padding: 0;
                  margin: 0;
                  margin-top: 4px;
                ">
                  ${lis}
                </ul>
              </div>
      `;
    }
  }
  return null;
};

