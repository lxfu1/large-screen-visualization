import styles from "./style.module.scss";

export interface ICard {
  title?: string;
  cardImage?: string;
  showTitle?: boolean;
  titleImage?: string;
  titleStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  childrenStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

export const Card = ({
  title = "卡片",
  cardImage,
  titleImage,
  titleStyle,
  showTitle = true,
  children,
  style = {},
  childrenStyle = {},
}: ICard) => {
  return (
    <div
      className={styles.card}
      style={{
        background: cardImage ? `url(${cardImage}) no-repeat` : "",
        ...style,
      }}
    >
      {showTitle && (
        <h5
          style={{
            background: `url(${titleImage}) no-repeat 12px`,
            ...titleStyle,
          }}
        >
          {title}
        </h5>
      )}

      <div className={styles.children} style={childrenStyle}>
        {children}
      </div>
    </div>
  );
};
