<template>
    <div typeof="SoftwareApplication">
        <h1 propertty="name">Education</h1>
        <ul>
            <li>
                <article title="Ho Chi Minh City University of Science">
                    <h2>
                        Ho Chi Minh City University of Science
                        <small><code>(HCMUS)</code></small>
                    </h2>
                    <p>
                        <strong>Website: </strong>
                        <a
                            rel="noreferrer noopener"
                            href="https://hcmus.edu.vn"
                            target="_blank"
                            >https://hcmus.edu.vn</a
                        >
                    </p>
                    <p
                        property="applicationCategory"
                        content="DeveloperApplication"
                    >
                        <strong>Major: </strong>Software Engineering
                    </p>
                    <p property="aggregateRating" typeof="AggregateRating">
                        <strong>GPA: </strong
                        ><span property="ratingValue">6.7</span>/<span
                            property="ratingCount"
                            >10</span
                        >
                    </p>
                    <p>
                        <strong>From: </strong>
                        <time datetime="August 2016">08/2016</time>
                        <span>-</span>
                        <time datetime="now">now</time>
                    </p>
                </article>
            </li>
        </ul>
    </div>
</template>
