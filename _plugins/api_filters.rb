# Ref Source
# https://bilaw.al/building-apis-with-jekyll.html

module Jekyll
    module ApiFilter
        # This will take multi-dimensional hash and \
        # convert it into a flattened array of hashes.
        def flatten_hash(input)
            all_values = input.to_a.flatten
            hash_values = all_values.select { |value| value.class == Hash }
            most_nested_values = []

            if hash_values.count > 0
                hash_values.each do |hash_value|
                    most_nested_values << flatten_hash(hash_value)
                end

                most_nested_values.flatten
            else
                return input
            end
        end

        # This will take an array of hashes and \
        # only show columns that have been explicitly approved
        def filter_fields(input, fields)
            downcased_fields = fields.split(",").map { |field| field.strip.downcase }

            input.map do |entry|
                entry.select do |key, value|
                    downcased_fields.include?(key.downcase)
                end
            end
        end

        # This will take an input and wrap a \
        # hash around it with a designated key with \
        # a timestamp
        def wrap_with_key(input, key)
            {
                key => input,
                :status => "OK",
                :last_updated => Date.today
            }
        end
    end
end

Liquid::Template.register_filter(Jekyll::ApiFilter)
