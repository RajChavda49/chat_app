function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" style={{ margin: "1rem", color: "red" }}>
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        style={{
          width: "20%",
          margin: "0",
          padding: "10px",
          color: "white",
          backgroundColor: "blue",
          borderRadius: "5px",
        }}
      >
        Reload
      </button>
    </div>
  );
}

export default ErrorFallback;
