const AUTHOR_AVATAR =
  'https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg'

export function BlogCard({ image, category, title, description, author, date }) {
  return (
    <article className="flex flex-col gap-4">
      <img
        src={image}
        alt={title}
        className="aspect-[4/3] w-full rounded-2xl object-cover"
      />

      <span className="inline-flex w-fit rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-semibold text-[#166534]">
        {category}
      </span>

      <h3 className="text-xl font-bold leading-snug text-[#111827]">
        {title}
      </h3>

      <p className="line-clamp-2 text-sm leading-relaxed text-[#6b7280]">
        {description}
      </p>

      <div className="flex items-center gap-3 text-sm">
        <img
          src={AUTHOR_AVATAR}
          alt={author}
          className="h-10 w-10 shrink-0 rounded-full object-cover"
        />
        <span className="font-medium text-[#111827]">{author}</span>
        <span className="text-[#d1d5db]" aria-hidden="true">
          |
        </span>
        <span className="text-[#6b7280]">{date}</span>
      </div>
    </article>
  )
}
