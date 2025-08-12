{/* Smooth cascade fade-in + blur reveal results */}
{!loading && result && (
  <section
    className={`mt-2 rounded-lg border bg-card text-card-foreground shadow-sm transition-opacity duration-700 ease-out ${
      showResults ? "opacity-100" : "opacity-0"
    }`}
  >
    <article className="p-6">
      {toHtml
        .split(/<\/p>|<br\s*\/?>/i)
        .filter((block) => block.trim() !== "")
        .map((block, i) => (
          <div
            key={i}
            className={`transition-all duration-700 ease-out ${
              showResults ? "opacity-100 blur-0" : "opacity-0 blur-sm"
            }`}
            style={{
              transitionDelay: `${i * 100}ms`,
            }}
            dangerouslySetInnerHTML={{ __html: block + "</p>" }}
          />
        ))}
    </article>
  </section>
)}
