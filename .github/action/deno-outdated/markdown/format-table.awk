#!/usr/bin/awk -f

BEGIN { FS = "│"; OFS = "|" }

# Skip separator lines
/^┌|^└|^├/ { next }  

# Process table rows
/^│/ {  
  # Remove leading and trailing │ and spaces
  gsub(/^│|│$/, "");
  
  # Convert each cell by trimming spaces
  for (i=1; i<=NF; i++) {
    gsub(/^[[:space:]]+|[[:space:]]+$/, "", $i);
  }
  
  # Print as markdown table row with proper column alignment
  # Skip the first empty column if it exists
  if ($1 == "") {
    print $2 OFS $3 OFS $4 OFS $5;
  } else {
    print $1 OFS $2 OFS $3 OFS $4;
  }
  
  # Add header separator after the first data row
  if (NR == 2) {
    print "---|---|---|---";
  }
}