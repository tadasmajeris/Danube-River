import React, {Component, createRef} from "react";
import {map} from "../../core/utils";
import Popup from "./Popup";
import Country from "./Country";
import HotSpot from "./HotSpot";

const MAP = {
  width: 1440,
  height: 900,
};

export default class MapZoomed extends Component {
  #map = createRef();

  state = {
    hotSpots: [
      {active: true, x: 269, y: 214, tag: 'Sturgeons', title: 'The ‘Danube dinosaur’ facing extinction'},
      {active: false, x: 499, y: 267, tag: 'Sturgeons', title: 'The ‘Danube dinosaur’ facing extinction'},
      {active: false, x: 909, y: 620, tag: 'Sturgeons', title: 'The ‘Danube dinosaur’ facing extinction'},
      {active: false, x: 1240, y: 591, tag: 'Sturgeons', title: 'The ‘Danube dinosaur’ facing extinction'},
      {active: false, x: 1320, y: 561, tag: 'Sturgeons', title: 'The ‘Danube dinosaur’ facing extinction'},
    ],
    popupPosition: {x: 0, y: 0},
  };

  componentDidMount() {
    this.#setPopupPosition();
    window.addEventListener('resize', this.#setPopupPosition);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.#setPopupPosition);
  }

  #setPopupPosition = () => {
    const activeHotSpot = this.#getActiveHotSpot();
    if (!activeHotSpot) {
      return;
    }
    const rect = this.#map.current.getBoundingClientRect();
    const popupPosition = {
      x: map(activeHotSpot.x, 0, MAP.width, 0, rect.width) + rect.left,
      y: map(activeHotSpot.y, 0, MAP.height, 0, rect.height) + rect.top,
    };
    this.setState({popupPosition});
  };

  #toggleHotSpot = index => async () => {
    const hotSpots = this.state.hotSpots.map((hotSpot, hotSpotIndex) => {
      hotSpot.active = hotSpotIndex === index;
      return hotSpot;
    });
    await this.setState({hotSpots});
    this.#setPopupPosition();
  };

  #getActiveHotSpotIndex = () => {
    return this.state.hotSpots.findIndex(hotSpot => hotSpot.active);
  };

  #getActiveHotSpot = () => {
    const activeHotSpotIndex = this.#getActiveHotSpotIndex();
    return activeHotSpotIndex === -1 ? null : this.state.hotSpots[activeHotSpotIndex];
  };

  render() {
    const activeHotSpot = this.#getActiveHotSpot();

    return (
      <div className="MapZoomed">
        <svg viewBox={`0 0 ${MAP.width} ${MAP.height}`} style={{width: '100%'}} ref={this.#map}>
          <defs>
            <path id="prefix__a" d="M0 0h1440v900H0z"/>
            <path id="prefix__c" d="M.767 0h2560v1440H.767z"/>
          </defs>
          <g fill="none" fillRule="evenodd">
            <g>
              <mask id="prefix__b" fill="#fff">
                <use xlinkHref="#prefix__a"/>
              </mask>
              <g mask="url(#prefix__b)">
                <g transform="translate(-561 -270)">
                  <mask id="prefix__d" fill="#fff">
                    <use xlinkHref="#prefix__c"/>
                  </mask>
                </g>
              </g>
              <g
                mask="url(#prefix__b)"
                stroke="#00FFE4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={5}
              >
                <path
                  d="M577.376 308.465l-9.808 4.219-14-1.53-10.703-7.919-8.186-11.632-21.883 1.061-6.19-3.633-6.393.796-7.448-2.877-6.09 1.755-1.894-2.245-5.829 4.755-.52 6.326-5.887 5.367-11.643 1.429-1.504 3.449-14.014-5.49-3.24 3.857-10.298 2.143-5.626-5.245-14.232-4.469-2.806-4.306-11.766-.988c-1.155 1.173-2.186 1.717-3.093 1.632-.908-.084-2.747-.465-5.517-1.142-1.059-.253-1.672-.634-1.839-1.142-.166-.509 0-1.488.502-2.938.09-.287-.02-.776-.335-1.468-.313-.692-.843-1.617-1.588-2.774l-1.17-.898c-.13.346-.325.537-.585.571-.26.035-.65.035-1.17 0 .055.502-.001.855-.167 1.06-.167.207-.417.288-.753.246-.44-.543-.747-.979-.92-1.306-.17-.327-.162-.724.028-1.19l-.445-.85c.041-.44-.014-.82-.167-1.142-.153-.321-.404-.457-.752-.408-.343.44-.622.712-.836.816-.215.105-.549.132-1.003.082-.428-.327-.762-.49-1.003-.49-.242 0-.409.136-.502.408.026.3.081.49.167.571.477.449 1.016.577 1.087.735.508 1.122-.54.889-1.839-.408-.687-.686-.703-.839-1.42-1.55-.307-.304-.606-.335-1.255-1.061-.24-.269-1.086.163-1.588-.49-.501-.653-1.17-1.06-2.006-2.04a6.91 6.91 0 01-1.254-2.121c.882.49.324.272-1.671-.653-.91-.421-1.105-.759-2.424-1.387-.472-.224-.335-1.305-.836-1.468-.165-.054-.707-.195-1.627-.423-.327-.081-1.258-1.2-1.967-1.372-.28-.069-.438.777-.92.897-.188.047-.579-.124-1.172-.512M940.376 672.684c1.992.679 3.518 1.352 4.578 2.02 1.398.882 2.257 2.449 4.162 3.539 1.793 1.025 4.29 2.654 7.491 4.886l6.243 1.01 1.665 2.865-2.497 4.044-7.658 1.938a289.385 289.385 0 00-1.915 5.728 204.42 204.42 0 00-1.53 5.133l2.945 3.46 10.655 3.37 13.734-4.718 9.656-.505c2.97.78 4.94 1.398 5.91 1.853 1.714.806 2.24 2.041 3.33 2.443 2.013.743 3.844.743 5.494 0h5.577c.47.692 1.135 1.253 1.997 1.685 1.023.513 2.364.094 3.247 1.011 1.6 1.665 5.92 1.603 11.154 3.202 1.452.443 2.795 1.45 5.244 2.527 1.13.497 3.266 1.311 6.41 2.443l10.071-1.685c2.645-2.134 4.476-3.51 5.494-4.128 1.018-.618 2.96-1.151 5.827-1.6 2.114.643 3.723 1.176 4.828 1.6 1.633.627 3.203.898 3.995 1.432 1.595 1.076 4.092 2.508 7.492 4.297 1.119-1.428 2.478-2.215 4.078-2.36 1.132-.101 2.082-.709 5.017.031.81.205 2.024-.451 3.64-1.968 1.219-.341 2.412-.004 3.58 1.011 1.167 1.015 2.693 2.11 4.578 3.286l5.743-1.18c2.775 1.741 4.606 3.258 5.494 4.55.888 1.291 2.358 2.218 4.412 2.78a12.896 12.896 0 005.327-1.685c1.665-.955 3.524-1.152 5.577-.59 2.941-1.573 5.494-3.033 7.658-4.38.66-.411 1.861.685 4.495-.253.979-.35 2.172-1.332 3.58-2.95 1.523-1.449 2.716-2.432 3.578-2.948 1.171-.7 2.618-3.303 3.247-4.128 2.018-2.645 3.63-4.779 5.077-6.402 1.694-1.901 1.94-.21 4.246-2.275.752-.674 2.068-4.61 4.411-6.487.653-.522 2.29-.803 4.911-.842 2.145-.956 3.977-1.77 5.494-2.443 1.418-.629 4.029-2.523 5.91-2.949.845-.191 2.45.67 4.162.758 1.462.076 5.356-1.629 6.326-1.769 1.57-.226 1.72.41 4.079.337.975-.03 2.964-1.117 4.578-1.348.62-.089 1.224-1.09 2.33-1.18.798-.064 1.714.02 2.748.254 1.789-.647 3.093-1.18 3.912-1.601 2.293-1.178 4.284-2.598 5.494-3.033 1.859-.667 3.995-.892 6.41-.674 1.292-.638 2.347-.975 3.162-1.01.901-.04.914.911 1.998 1.01.09.008 1.332-.337 3.58-.674 2.247-.337-.827 1.768 5.743 2.106.884.046 2.315-.924 3.912-1.095.611-.065 1.583.103 2.914.506M132.93 290.895l-3.082 5.081-11.895 4.812-2.3 3.526-10.376-.497-8.972 15.223-8.364.934-2.677-2.468-3.835 1.514-6.31-1.93-6.366 3.734-.97 3.713-2.04.249.145-2.51-5.5 2.883-4.905 4.688.116 2.26-11.476 1.577-3.747-3.547m318-57.98c-.706-.53-1.177-.913-1.415-1.15-.864-.865-1.283-1.41-1.746-1.316-.376.077-.427.452-.915 1.234-.243.387-.686.442-1.331.164-.555.11-1.497.137-2.828.082-1.331-.055-2.413-.712-3.244-1.973-.849.027-2.318-.274-4.409-.904a76.858 76.858 0 01-2.078-.662c-.443-.148-1.029.751-1.748.498-.86-.303-2.523-1.372-4.991-3.207l-1.83-1.89c-.735.1-1.456-.064-2.163-.494-.38-.23-.166-1.808-.333-1.973-.11-.11-.526-.027-1.247.247-.254-.02-.364-.211-.333-.575.031-.364.253-.83.665-1.398.167 0 .056-.301-.332-.904s-.888-.74-1.498-.411c-.193.338-.47.064-.831-.822-.2-.49-1.676 1.651-1.913.822-.066-.23-1.03.075-.915-.822.044-.35 1.194-.298 1.58-1.316.16-.42-.257-1.214-1.248-2.384-.368-1.02-.728-1.788-1.081-2.301-.353-.514-.967-1.165-1.843-1.953-.158-.726-.43-1.253-.819-1.582-.388-.33-1.33-.905-2.828-1.727l-4.15-.135c-.546 1.118-1.131 1.738-1.756 1.862-.937.185-1.7-.054-3.078-.905-.525-.324-.58-1.716-.831-2.548-.125-.415-.347-.908-.666-1.48l-4.159-2.795-2.246-.246c-1.088.629-1.892.958-2.412.986-.52.029-1.268.029-2.246 0 .43.657-.402.657-2.495 0-.987-.31-.643-2.885-2.08-3.453-1.074-.424-1.545-1.328-1.414-2.712l-4.99-2.138-1.758 1.359c-3.017-2.71-5.426-4.368-7.226-4.976-1.8-.608-4.545-.69-8.235-.247l-7.486-.328c.262 1.17.733 2.375 1.414 3.617.68 1.241-.346 2.063-3.078 2.466l1.664 1.644v1.562a44.243 44.243 0 00-3.827 2.466c-.824.59-2.391-.427-4.159-.575-.705-.06-1.842.133-3.41.575l-3.743 1.727-2.246 6.905c-1.22 1.48-4.215 2.822-8.984 4.028-2.477.626-7.672 1.804-16.303 3.288-2.66.458-5.199-1.26-10.564-.41-3.58.566-10.956 1.279-22.126 2.137l-10.231 7.316-14.39 7.728-.882 8.47-20.925 5.766-4.587 4.5M595.376 326.684h4.091c2.382 2.267 3.968 3.953 4.76 5.056 1.44 2.01 1.988 4.436 2.838 5.472.974 1.186 3.096.712 4.843 2.238.691.604 1.61 2.179 2.756 4.725l2.505-.58c2.843 2.896 5.097 4.858 6.763 5.886 1.666 1.027 3.82 1.785 6.46 2.272l16.524-1.616 14.507 2.162 10.187-2.818 14.185.488 4.602-5.628 10.855.498 2.742 4.626 5.936-5.12 6.446 3.861-.336 12.193-4.71 12.675 1.487 4.092-2.07 6.274-4.988 2.75-5.265 18.865 1.575 8.037 4.507 4.45-2.844 18.865 5.425 11.038-9.61 8.835 4.039 11.773-2.362 7.66 2.435 7.955.219 11.036-5.323 1.93-10.354 14.124 8.473 9.926"
                />
                <path
                  d="M856.376 620.335l3.84 4.289 11.434 1.514 1.905 4.247m0 0l.477 4.373 3.726.085m.307.098l19.383 2.887 5.55 10.766 3.805 4.268 2.93-1.114 7.727-15.308 9.54-6.202c4.01 4.262 7.313 7.384 9.908 9.365 1.558 1.19 3.353-1.068 5.319 0 .872.474 2.424 1.945 4.654 4.412.521 1.536.521 2.563 0 3.08-.521.517-2.067 1.024-4.636 1.52l-4.257-3.101-3.574 1.581-.914 4.662h-4.654c-.664 1.72-.941 2.912-.831 3.58.11.667 1.163 1.332 3.158 1.997v6.91l4.571 4.578 5.569.916v5.66m294.56 7.952l.78-4.29 3.204.841 15.534-7.106m-19.518 10.555l10.033.4m-.303 1.765l.303-1.766m0 0l5.762-4.668m0 0l12.082-2.523m-12.082 2.523l3.723-6.286m0 0l4.144-5.152 9.039-2.838 2.337-5.278 4.114-2.964.289-4.69-2.713-2.102 2.121-12.132-4.33-6.119.75-2.922m-7.392 47.96l2.685-2.25m-2.685 2.25l13.354-5.256m-8.662-51.304l4.172-4.836-.274-2.46m-1.675 11.964l-2.497-.883.274-3.785m2.223 4.668l.708-2.502-2.93-2.166m.317-.778l.346-3.47 3.234-3.048m-.606 13.289l-1.069-1.325m.477 3.932l.592-2.607m9.846 13.603l-10.438-10.996m.592-2.607l1.184-1.115m-.578-12.174l.823-5.235m-.823 5.235l.823-5.235m-.245 17.41l8.706 1.24 2.38-3.638m-11.086 2.397l.463-3.238 3.521-2.544-2.613-4.773 1.3-3.217-1.589-13.667m-.837 10.03l-1.357-4.69 1.415-4.688m0 0l.78-.652m-.78.652l3.508-7.864m-2.729 7.212l2.729-7.212m-.722-4.079l.635-3.995m-.635 3.995l.635-3.995m.087 7.906l-.722-3.91m.635-3.996l.477-.673m-.39 8.579l2.483-1.682-2.093-6.897m-.015 89.824l2.483-3.995m-2.483 3.995l2.483-3.995m-2.468-85.829l1.833-4.142m0 0l3.003-11.774 4.172-2.397 5.356 2.523 1.14-5.004 4.39 2.018 4.431 11.585 22.94 9 5.327-1.64-2.584-3.596 3.364-2.208-1.386-2.355 10.409 4.5 1.126-4.584 9.023-4.1m-61.37 44.428l-.304-19.133h2.527l1.357-3.533-6.627-4.562 2.383-4.08-.91-2.354-7.767-2.734m.635 89.97l2.817-6.854m-1.012-15.054l.188-5.804m-.188 5.804l-1.242-2.46 1.43-3.344m4.706 16.127l-4.894-10.323m1.012 15.054l1.37-1.072m-1.37 1.072l3.521-3.658m-2.151 2.586l2.512-3.659m-2.512 3.659l2.151-2.586m-1.92-34.315l.577-2.922m-.577 2.922l.577-2.922m0 0l.939-1.283m0 0l2.772-4.542m-2.772 4.542l2.772-4.542m-2.368 43.062l.36-1.073m40.02-73.065l3.38 1.724.344 2.754 2.485-1.955 3.449 1.472m0 0l1.357 3.09 14.075 7.591m-15.432-10.681l29.755 1.093m-16.055-18.44l8.59-5.445 2.627.63m-11.217 4.815l6.497.105 4.72-4.92m-9.485 32.843l1.733-1.85-1.82-1.262 3.956.316 1.747 2.607-2.338 2.376m-3.278-2.187l3.278 2.187m0 0l4.735 1.03m-1.906-15.601l1.502-2.208 6.38 4.794m-5.976 13.015l.78 1.24m-.78-1.24l.78 1.24m0 0l.36.421m0 0l1.704-.105-1.184 1.45m-.52-1.345l.52 1.346m-.188-39.067l4.562-.84m-4.374 39.907l1.949 3.196m0 0l2.007-1.325.13 2.355m-2.137-1.03l2.137 1.03m.115.126l2.05-2.502-1.054 3.175m-.996-.673l.996.673m-.823-44.933l3.913 2.88m-3.913-2.88l8.171 1.43m-7.895 22.666l7.462.274m-7.462-.274l6.827-4.836 1.444 1.893-.809 3.217m-6.915 20.563l6.222-1.724m-3.132-40.328l4.258-1.45m-4.258 1.45l6.655 1.66 1.43-2.08m-4.953 40.748l1.04.694m-1.04-.694l1.04.694m-.347-19.533l13.196 1.072m-12.85 18.46l8.547 7.444m-8.46-49.916l3.826 1.03m0 0l7.03 6.75 1.546 6.244M732.376 583.596l8.632-3.905 2.65 3.911 14.664-.862 3.387-4.056 7.57 7.82 13.695-.04 10.162 12.237.087 3.407-3.793 1.577-.55 3.68 5.096 7.802 5.037 3.238m0 0l11.103-1.661.782 9.379 5.718 6.666 6.311 1.895 33.449-14.385M577.376 309.684l3.714 2.805 6.872.437 1.799 6.327 5.615 5.43M696.7 520.684h3.801l-1.78 2.367 1.78 2.367-3.155 1.96-.97 4.08h2.346l3.155-1.142v3.183l-4.53.898 3.154 2.612 3.884-2.612 1.375 3.592-5.219 1.52 3.825 4.19-4.017 4.5-.688 4.578 4.03 2.877 3.715-2.156 5.035 4.21-1.197 2.114-4.815-.616-.701 4.068 2.476 3.492-3.44 3.266 16.62 11.664 10.992.988"
                />
              </g>
            </g>
            <path fill="#13551B" d="M675 409h99v15h-99z"/>

            <Country x={675} y={409} name="Hungary"/>
            <Country x={687} y={243} name="Slovakia"/>
            <Country x={1060} y={792} name="Bulgaria"/>
            <Country x={1269} y={382} name="Moldova"/>
            <Country x={1186} y={179} name="Ukraine"/>
            <Country x={552} y={649} name="Bosnia & Herzagovina"/>
            <Country x={797} y={715} name="Serbia"/>
            <Country x={389} y={348} name="Austria"/>
            <Country x={376} y={500} name="Slovenia"/>
            <Country x={109} y={583} name="Italy"/>
            <Country x={421} y={161} name="Czechia"/>
            <Country x={1020} y={507} name="Romania"/>
            <Country x={499} y={561} name="Croatia"/>
            <Country x={64} y={99} name="Germany"/>

            {this.state.hotSpots.map((hotSpot, index) => (
              <HotSpot
                key={`hot-spot-${index}`}
                x={hotSpot.x}
                y={hotSpot.y}
                onClick={this.#toggleHotSpot(index)}
              />
            ))}
          </g>
        </svg>

        {activeHotSpot && (
          <Popup
            tag={activeHotSpot.tag}
            title={activeHotSpot.title}
            x={this.state.popupPosition.x}
            y={this.state.popupPosition.y}
          />
        )}
      </div>
    );
  }
}