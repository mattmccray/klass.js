
desc "Compiles from source scripts into dist/"
task :build do
  puts "Building klass libraries..."

  klass = jsLibrary('klass')
#  klass.save_to 'dist/klass.js'
  klass.save_compressed_to 'dist/individual/klass.min.js'

  typeOf = jsLibrary %w(typeOf)
  typeOf.save_compressed_to 'dist/individual/typeOf.min.js'

  dateUtils = jsLibrary %w(dateUtils)
  dateUtils.save_compressed_to 'dist/individual/dateUtils.min.js'

  watch = jsLibrary %w(watch)
  watch.save_compressed_to 'dist/individual/watch.min.js'

  prototypeOf = jsLibrary %w(prototypeOf)
  prototypeOf.save_compressed_to 'dist/individual/prototypeOf.min.js'

  parseArgs = jsLibrary %w(parseArgs)
  parseArgs.save_compressed_to 'dist/individual/parseArgs.min.js'

  all = jsLibrary %w(klass prototypeOf typeOf watch dateUtils parseArgs)
  all.save_compressed_to 'dist/klass.js'

  puts 'Done.'
end


# ===========
# = Helpers =
# ===========

begin
  require 'sprockets'
  require 'lib/jsmin.rb'
rescue
  puts "Build require sprockets:"
  puts
  puts "  [sudo] gem install sprockets"
  puts
  exit(1)
end

class Sprockets::Concatenation
  def save_compressed_to(filename) 
    src = JSMin.minify(to_s)
    timestamp = mtime
    File.open(filename, "w") { |file| file.write(src) }
    File.utime(timestamp, timestamp, filename)
    true
  end
end

def jsLibrary(files, srcDir='src')
  Sprockets::Secretary.new(
    :asset_root   => "assets",
    :load_path    => ["src", '.'],
    :source_files => [files].flatten.collect {|filename| 
        "#{srcDir}/#{filename}#{(filename[-3..-1] == '.js') ? '' : '.js'}"
    }
  ).concatenation
end
