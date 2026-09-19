import styled from "styled-components";

type ButtonProps = {
  onClick?: () => void;
};

const Button = ({ onClick }: ButtonProps) => {
  return (
    <StyledWrapper>
      <button className="wooden-cart-button mt-4" onClick={onClick} type="button">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        <span className="button-text">Add to Inventory</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Button Container */
  .wooden-cart-button {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 15px 30px;
    border: none;
    background: linear-gradient(
      to bottom,
      #f5deb3,
      #deb887
    ); /* Lighter wood color */
    border-radius: 25px;
    box-shadow:
      inset 0 5px 10px rgba(255, 255, 255, 0.5),
      inset 0 -5px 10px rgba(0, 0, 0, 0.2),
      0 5px 15px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: perspective(500px) rotateX(5deg);
    transform-style: preserve-3d;
  }

  /* Wood grain texture */
  .wooden-cart-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(139, 90, 43, 0.1) 25%,
      transparent 25%,
      transparent 75%,
      rgba(139, 90, 43, 0.1) 75%
    );
    background-size: 10px 10px;
    opacity: 0.5;
    border-radius: 25px;
    transition: all 0.4s ease;
    transform: translateZ(-1px);
  }

  /* SVG Icon */
  .wooden-cart-button svg {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    fill: #5c4033; /* Dark brown color for icon */
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: translateZ(10px);
  }

  /* Text */
  .button-text {
    position: relative;
    z-index: 1;
    color: #5c4033; /* Dark brown color for text */
    font-family: Arial, sans-serif;
    font-weight: bold;
    font-size: 16px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform: translateZ(10px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }

  /* Hover State */
  .wooden-cart-button:hover {
    transform: perspective(500px) rotateX(0deg) translateY(-3px);
    box-shadow:
      inset 0 6px 12px rgba(255, 255, 255, 0.6),
      inset 0 -6px 12px rgba(0, 0, 0, 0.25),
      0 8px 20px rgba(0, 0, 0, 0.35);
    background: linear-gradient(to bottom, #f5e0c0, #e0c49c);
  }

  .wooden-cart-button:hover svg {
    transform: translateZ(15px) scale(1.2) rotate(5deg);
    filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
  }

  .wooden-cart-button:hover .button-text {
    transform: translateZ(15px) translateX(5px);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* Active/Clicked State */
  .wooden-cart-button:active {
    transform: perspective(500px) rotateX(2deg) translateY(2px);
    box-shadow:
      inset 0 3px 6px rgba(255, 255, 255, 0.3),
      inset 0 -3px 6px rgba(0, 0, 0, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.2);
    background: linear-gradient(to bottom, #e0c49c, #c19a6b);
  }

  .wooden-cart-button:active svg {
    transform: translateZ(5px) scale(0.9) rotate(-5deg);
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
  }

  .wooden-cart-button:active .button-text {
    transform: translateZ(5px) translateY(1px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
`;

export default Button;